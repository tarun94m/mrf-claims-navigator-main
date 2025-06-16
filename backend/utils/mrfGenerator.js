export const generateMRFFile = (claims, customer) => {
  return {
    reporting_entity_name: customer,
    reporting_entity_type: "health_plan",
    plan_name: `${customer} Health Plan`,
    plan_id_type: "hios",
    plan_id: `${customer.replace(/\s+/g, "")}_2024`,
    plan_market_type: "individual",
    last_updated_on: new Date().toISOString().split("T")[0],
    version: "1.0.0",
    in_network: [
      {
        negotiation_arrangement: "ffs",
        name: `${customer} Network`,
        billing_code_type: "CPT",
        billing_code_type_version: "2024",
        billing_code: "BUNDLE",
        description: "Bundled Healthcare Services",
        negotiated_rates: claims.map((claim, index) => ({
          provider_groups: [
            {
              npi: [claim.provider_tin || "0000000000"],
              tin: {
                type: "ein",
                value: claim.provider_tin || "00-0000000",
              },
            },
          ],
          provider_references: [claim.provider_name],
          negotiated_prices: [
            {
              negotiated_type: "negotiated",
              negotiated_rate: claim.allowed_amount,
              expiration_date: "2024-12-31",
              service_code: [claim.procedure_code],
              billing_class: claim.billing_class,
            },
          ],
        })),
      },
    ],
    provider_references: [
      ...new Set(
        claims.map((claim, idx) => ({
          provider_group_id: idx,
          provider_name: claim.provider_name,
          provider_address: {
            type: "billing",
            address: "Address not provided",
            city: "City not provided",
            state: "State not provided",
            zip: "00000",
          },
        }))
      ),
    ],
  };
};
