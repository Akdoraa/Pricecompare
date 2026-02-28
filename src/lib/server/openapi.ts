export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Pricecompare API",
    version: "1.0.0",
    description:
      "API for electronics price comparison, source diagnostics, and saved deals.",
  },
  servers: [
    {
      url: "/",
      description: "Current server",
    },
  ],
  tags: [
    { name: "Compare", description: "Comparison lifecycle endpoints" },
    { name: "Saved Deals", description: "Saved deals and alert endpoints" },
  ],
  paths: {
    "/api/compare/start": {
      post: {
        tags: ["Compare"],
        summary: "Start a price comparison request",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CompareStartRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Request accepted or rejected by query classifier",
            content: {
              "application/json": {
                schema: {
                  oneOf: [
                    { $ref: "#/components/schemas/CompareStartProcessingResponse" },
                    { $ref: "#/components/schemas/CompareStartRejectedResponse" },
                  ],
                },
              },
            },
          },
          400: {
            description: "Invalid request payload",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/compare/{requestId}": {
      get: {
        tags: ["Compare"],
        summary: "Poll comparison status by requestId",
        parameters: [
          {
            name: "requestId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Current comparison status",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CompareStatusResponse" },
              },
            },
          },
          404: {
            description: "Comparison not found / expired",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/ErrorResponse" },
                    {
                      type: "object",
                      properties: {
                        status: { type: "string", enum: ["expired"] },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      },
    },
    "/api/saved": {
      get: {
        tags: ["Saved Deals"],
        summary: "Get saved deals by session",
        parameters: [
          {
            name: "sessionId",
            in: "query",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Saved deals list",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SavedDealsResponse" },
              },
            },
          },
          400: {
            description: "Missing sessionId",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/saved/toggle": {
      post: {
        tags: ["Saved Deals"],
        summary: "Toggle saved deal for a product",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/SavedToggleRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Save state updated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SavedToggleResponse" },
              },
            },
          },
          400: {
            description: "Missing required fields",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/saved/alert": {
      post: {
        tags: ["Saved Deals"],
        summary: "Set alert settings for a saved product",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/SavedAlertRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Alert updated, latest deals returned",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SavedDealsResponse" },
              },
            },
          },
          400: {
            description: "Missing required fields",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          error: { type: "string" },
        },
        required: ["error"],
      },
      CompareFilters: {
        type: "object",
        properties: {
          brands: { type: "array", items: { type: "string" } },
          minPrice: { type: "number" },
          maxPrice: { type: "number" },
        },
      },
      CompareStartRequest: {
        type: "object",
        properties: {
          query: { type: "string", example: "macbook pro m3" },
          sessionId: { type: "string", example: "session-123" },
          maxResults: { type: "integer", minimum: 1, example: 10 },
          postalCode: { type: "string", example: "94107" },
          filters: { $ref: "#/components/schemas/CompareFilters" },
        },
        required: ["query", "sessionId"],
      },
      CompareStartProcessingResponse: {
        type: "object",
        properties: {
          requestId: { type: "string" },
          status: { type: "string", enum: ["processing"] },
          initialResults: {
            type: "array",
            items: { $ref: "#/components/schemas/ComparisonOffer" },
          },
          sourcesPending: {
            type: "array",
            items: { $ref: "#/components/schemas/SourceName" },
          },
        },
        required: ["requestId", "status", "initialResults", "sourcesPending"],
      },
      CompareStartRejectedResponse: {
        type: "object",
        properties: {
          requestId: { type: "null" },
          status: { type: "string", enum: ["rejected"] },
          initialResults: { type: "array", items: {} },
          sourcesPending: { type: "array", items: {} },
          reason: { type: "string", enum: ["NON_ELECTRONICS_QUERY"] },
        },
        required: ["requestId", "status", "initialResults", "sourcesPending", "reason"],
      },
      CompareStatus: {
        type: "string",
        enum: ["processing", "complete", "partial_error", "expired"],
      },
      SourceName: {
        type: "string",
        enum: ["amazon", "walmart", "ebay", "etsy", "bestbuy", "google_shopping"],
      },
      SourceDiagnostic: {
        type: "object",
        properties: {
          source: { $ref: "#/components/schemas/SourceName" },
          state: {
            type: "string",
            enum: ["pending", "success", "timeout", "error"],
          },
          latencyMs: { type: "number" },
          error: { type: "string" },
        },
        required: ["source", "state"],
      },
      ComparisonOffer: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          category: { type: "string" },
          store: { $ref: "#/components/schemas/SourceName" },
          productUrl: { type: "string" },
          image: { type: "string" },
          itemPrice: { type: "number" },
          shippingPrice: { type: "number" },
          fees: { type: "number" },
          estimatedTax: { type: "number" },
          totalLandedCost: { type: "number" },
          originalCurrency: { type: "string" },
          displayCurrency: { type: "string", enum: ["USD"] },
          fxRate: { type: "number" },
          fxTimestamp: { type: "string" },
          availability: { type: "string", enum: ["in_stock", "limited", "unknown"] },
          deliveryEta: { type: "string" },
          seller: { type: "string" },
          fetchedAt: { type: "string", format: "date-time" },
        },
        required: [
          "id",
          "title",
          "category",
          "store",
          "productUrl",
          "itemPrice",
          "shippingPrice",
          "fees",
          "estimatedTax",
          "totalLandedCost",
          "originalCurrency",
          "displayCurrency",
          "availability",
          "deliveryEta",
          "fetchedAt",
        ],
      },
      CompareStatusResponse: {
        type: "object",
        properties: {
          requestId: { type: "string" },
          status: { $ref: "#/components/schemas/CompareStatus" },
          results: {
            type: "array",
            items: { $ref: "#/components/schemas/ComparisonOffer" },
          },
          sourceDiagnostics: {
            type: "array",
            items: { $ref: "#/components/schemas/SourceDiagnostic" },
          },
          updatedAt: { type: "string", format: "date-time" },
        },
        required: ["requestId", "status", "results", "sourceDiagnostics", "updatedAt"],
      },
      SavedDealAlert: {
        type: "object",
        properties: {
          enabled: { type: "boolean" },
          targetPrice: { type: "number" },
        },
        required: ["enabled", "targetPrice"],
      },
      SavedDeal: {
        type: "object",
        properties: {
          productId: { type: "string" },
          savedAt: { type: "number" },
          priceAtSave: { type: "number" },
          alert: { $ref: "#/components/schemas/SavedDealAlert" },
        },
        required: ["productId", "savedAt", "priceAtSave"],
      },
      SavedDealsResponse: {
        type: "object",
        properties: {
          deals: {
            type: "array",
            items: { $ref: "#/components/schemas/SavedDeal" },
          },
        },
        required: ["deals"],
      },
      SavedToggleRequest: {
        type: "object",
        properties: {
          sessionId: { type: "string" },
          productId: { type: "string" },
        },
        required: ["sessionId", "productId"],
      },
      SavedToggleResponse: {
        allOf: [
          {
            type: "object",
            properties: {
              saved: { type: "boolean" },
            },
            required: ["saved"],
          },
          { $ref: "#/components/schemas/SavedDealsResponse" },
        ],
      },
      SavedAlertRequest: {
        type: "object",
        properties: {
          sessionId: { type: "string" },
          productId: { type: "string" },
          enabled: { type: "boolean" },
          targetPrice: { type: "number" },
        },
        required: ["sessionId", "productId"],
      },
    },
  },
} as const;

