import { type OperatorPartnerAddressType, type OperatorPartnerRecord, type OperatorRecordWithNonOpAddresses } from "../../src/types/interfaces";

export const operatorListReturnFromSupabase = [
    {
        "apc_id": {
            "id": "3b34a78a-13ad-40b5-aecd-268d56dd5e0d",
            "name": "Corr and Whit Oils Company",
            "active": true,
            "partner": [
                {
                    "id": 45,
                    "zip": "89899",
                    "city": "Houston",
                    "state": "Texas",
                    "suite": "5678",
                    "active": true,
                    "apc_id": {
                        "id": "9e96df60-9fa3-4330-8318-972504f1af66",
                        "name": "Corr and White Oil Company",
                        "active": true
                    },
                    "street": "2121 Lane Blvc",
                    "country": "United States",
                    "apc_op_id": "3b34a78a-13ad-40b5-aecd-268d56dd5e0d"
                }
            ]
        },
        "address": {
            "id": 66,
            "zip": "90078",
            "city": "Houston",
            "state": "Texas",
            "suite": "",
            "active": true,
            "street": "6789 S Blvd",
            "country": "United States"
        }
    }
];

export const operatorListReturnFromSupabaseEmpty = [];

export const operatorListReturnFromSupabaseWithSuiteNumber = [
    {
        "apc_id": {
            "id": "3b34a78a-13ad-40b5-aecd-268d56dd5e0d",
            "name": "Corr and Whit Oils Company",
            "active": true,
            "partner": [
                {
                    "id": 45,
                    "zip": "89899",
                    "city": "Houston",
                    "state": "Texas",
                    "suite": "5678",
                    "active": true,
                    "apc_id": {
                        "id": "9e96df60-9fa3-4330-8318-972504f1af66",
                        "name": "Corr and White Oil Company",
                        "active": true
                    },
                    "street": "2121 Lane Blvc",
                    "country": "United States",
                    "apc_op_id": "3b34a78a-13ad-40b5-aecd-268d56dd5e0d"
                }
            ]
        },
        "address": {
            "id": 66,
            "zip": "90078",
            "city": "Houston",
            "state": "Texas",
            "suite": "45",
            "active": true,
            "street": "6789 S Blvd",
            "country": "United States"
        }
    }
];

export const operatorListReturnFromSupabaseWithAddressUndefined = [
    {
        "apc_id": {
            "id": "3b34a78a-13ad-40b5-aecd-268d56dd5e0d",
            "name": "Corr and Whit Oils Company",
            "active": true,
            "partner": [
                {
                    "id": 45,
                    "zip": "89899",
                    "city": "Houston",
                    "state": "Texas",
                    "suite": "5678",
                    "active": true,
                    "apc_id": {
                        "id": "9e96df60-9fa3-4330-8318-972504f1af66",
                        "name": "Corr and White Oil Company",
                        "active": true
                    },
                    "street": "2121 Lane Blvc",
                    "country": "United States",
                    "apc_op_id": "3b34a78a-13ad-40b5-aecd-268d56dd5e0d"
                }
            ]
        },
        "address": {
            "id": 66,
            "zip": undefined,
            "city": undefined,
            "state": undefined,
            "suite": undefined,
            "active": true,
            "street": "6789 S Blvd",
            "country": undefined
        }
    }
];

export const operatorListReturnFromSupabaseWithAddressUndefinedSuiteIsText = [
    {
        "apc_id": {
            "id": "3b34a78a-13ad-40b5-aecd-268d56dd5e0d",
            "name": "Corr and Whit Oils Company",
            "active": true,
            "partner": [
                {
                    "id": 45,
                    "zip": "89899",
                    "city": "Houston",
                    "state": "Texas",
                    "suite": "5678",
                    "active": true,
                    "apc_id": {
                        "id": "9e96df60-9fa3-4330-8318-972504f1af66",
                        "name": "Corr and White Oil Company",
                        "active": true
                    },
                    "street": "2121 Lane Blvc",
                    "country": "United States",
                    "apc_op_id": "3b34a78a-13ad-40b5-aecd-268d56dd5e0d"
                }
            ]
        },
        "address": {
            "id": 66,
            "zip": undefined,
            "city": undefined,
            "state": undefined,
            "suite": '',
            "active": true,
            "street": "6789 S Blvd",
            "country": undefined
        }
    }
];

export const operatorListReturnFromSupabaseWithoutIDs = [
    {
        "apc_id": {
            "id": null,
            "name": "Corr and Whit Oils Company",
            "active": true,
            "partner": [
                {
                    "id": 45,
                    "zip": "89899",
                    "city": "Houston",
                    "state": "Texas",
                    "suite": "5678",
                    "active": true,
                    "apc_id": {
                        "id": "9e96df60-9fa3-4330-8318-972504f1af66",
                        "name": "Corr and White Oil Company",
                        "active": true
                    },
                    "street": "2121 Lane Blvc",
                    "country": "United States",
                    "apc_op_id": "3b34a78a-13ad-40b5-aecd-268d56dd5e0d"
                }
            ]
        },
        "address": {
            "id": null,
            "zip": "90078",
            "city": "Houston",
            "state": "Texas",
            "suite": "",
            "active": true,
            "street": "6789 S Blvd",
            "country": "United States"
        }
    }
];

export const operatorDectivatedSentToSupabase = 
   {
     "active": false,
     "address_active": false,
     "apc_address_id": 66,
     "apc_id": "3b34a78a-13ad-40b5-aecd-268d56dd5e0d",
     "apc_op_id": null,
     "apc_op_name": null,
     "city": "Houston",
     "country": "United States",
     "name": "Corr and Whit Oils Company",
     "partners": [
       {
         "active": true,
         "address_active": true,
         "apc_address_id": 45,
         "apc_id": "9e96df60-9fa3-4330-8318-972504f1af66",
         "city": "Houston",
         "country": "United States",
         "name": "Corr and White Oil Company",
         "state": "Texas",
         "street": "2121 Lane Blvc",
         "suite": "5678",
         "zip": "89899",
       },
     ],
     "state": "Texas",
     "street": "6789 S Blvd",
     "suite": "",
     "zip": "90078",
    };

export const operatorActivatedSentToSupabase = 
   {
     "active": true,
     "address_active": true,
     "apc_address_id": 66,
     "apc_id": "3b34a78a-13ad-40b5-aecd-268d56dd5e0d",
     "apc_op_id": null,
     "apc_op_name": null,
     "city": "Houston",
     "country": "United States",
     "name": "Corr and Whit Oils Company",
     "partners": [
       {
         "active": true,
         "address_active": true,
         "apc_address_id": 45,
         "apc_id": "9e96df60-9fa3-4330-8318-972504f1af66",
         "city": "Houston",
         "country": "United States",
         "name": "Corr and White Oil Company",
         "state": "Texas",
         "street": "2121 Lane Blvc",
         "suite": "5678",
         "zip": "89899",
       },
     ],
     "state": "Texas",
     "street": "6789 S Blvd",
     "suite": "",
     "zip": "90078",
    };

export const operatorDeactivatedFromSupabase = 
    {
    id: "3b34a78a-13ad-40b5-aecd-268d56dd5e0d",
    name: "Corr and Whit Oils Company",
    active: false,
};

export const operatorActivatedFromSupabase = 
    {
    id: "3b34a78a-13ad-40b5-aecd-268d56dd5e0d",
    name: "Corr and Whit Oils Company",
    active: true,
};

export const partnersLinkedOrUnlinked = [
    {
        "apc_id": "55817490-5603-4a65-9223-24c1f078dd81",
        "name": "Energy Oil Company",
        "apc_op_id": {
            "id": "4482e4ea-29ad-4f57-a30a-d67a6b3d8ec1",
            "name": "This Third Wheel Oil and Gas"
        },
        "address": {
            "id": 28,
            "zip": "99789",
            "city": "Austin",
            "state": "Texas",
            "suite": null,
            "street": "82333 South Blvd.",
            "country": "United States"
        }
    },
    {
        "apc_id": "a8fca8e7-3485-40fc-aea8-2278dbecfbfa",
        "name": "Corr and Whit Oil",
        "apc_op_id": {
            "id": "3b34a78a-13ad-40b5-aecd-268d56dd5e0d",
            "name": "Corr and Whit Oils Company"
        },
        "address": null
    },
    {
        "apc_id": "d09da985-e6be-48cd-8f52-c639353792c2",
        "name": "Corr and Whit Oil",
        "apc_op_id": {
            "id": "3b34a78a-13ad-40b5-aecd-268d56dd5e0d",
            "name": "Corr and Whit Oils Company"
        },
        "address": {
            "id": 34,
            "zip": "88799",
            "city": "Houston",
            "state": "Texas",
            "suite": null,
            "street": "6565 Poppy Lane",
            "country": "United States"
        }
    },
    {
        "apc_id": "dcfb31dd-1f04-45b0-8b70-5512c1fd4b24",
        "name": "Corr and Whit Oil",
        "apc_op_id": {
            "id": "3b34a78a-13ad-40b5-aecd-268d56dd5e0d",
            "name": "Corr and Whit Oils Company"
        },
        "address": {
            "id": 35,
            "zip": "88799",
            "city": "Houston",
            "state": "Texas",
            "suite": null,
            "street": "6565 Poppy Lane",
            "country": "Canada"
        }
    },
    {
        "apc_id": "74d7066b-d046-452d-8e04-ae3059e38dec",
        "name": "Thorton Oil and Company",
        "apc_op_id": {
            "id": "a45536f3-ac27-4f3b-9a70-b0bb536d9fc6",
            "name": "Thorton Oil and Company"
        },
        "address": {
            "id": 36,
            "zip": "77789",
            "city": "Dallas",
            "state": "Texas",
            "suite": "67787",
            "street": "3456 LandMine Way",
            "country": "United States"
        }
    },
    {
        "apc_id": "86eeaeb2-5f7a-499f-a69b-4b980d08bab1",
        "name": "Thorton Oil and Company",
        "apc_op_id": {
            "id": "a45536f3-ac27-4f3b-9a70-b0bb536d9fc6",
            "name": "Thorton Oil and Company"
        },
        "address": null
    },
    {
        "apc_id": "39c4adcb-438a-4855-bb3f-444ee10a83ca",
        "name": "Thorton Oil and Company",
        "apc_op_id": {
            "id": "a45536f3-ac27-4f3b-9a70-b0bb536d9fc6",
            "name": "Thorton Oil and Company"
        },
        "address": null
    },
    {
        "apc_id": "e5fed68a-82bb-4685-9dfa-762c00ebdfc9",
        "name": "Thorton Oil and Company",
        "apc_op_id": {
            "id": "a45536f3-ac27-4f3b-9a70-b0bb536d9fc6",
            "name": "Thorton Oil and Company"
        },
        "address": null
    },
    {
        "apc_id": "3ab29a40-8ef0-4778-95fd-6c427b56496a",
        "name": "Whit and Corr Oil",
        "apc_op_id": {
            "id": "01b272f7-ea18-48bc-9443-ba2f0c9376ff",
            "name": "Whit and Corr Oil"
        },
        "address": {
            "id": 8,
            "zip": "90089",
            "city": "Austin",
            "state": "Texas",
            "suite": "345",
            "street": "678 Main Street",
            "country": "United States"
        }
    },
    {
        "apc_id": "3cb2142c-8234-4566-af01-386253603e49",
        "name": "Corr Oil",
        "apc_op_id": {
            "id": "e769175a-5d6c-48b7-a639-489f4a39e647",
            "name": "Corr Oil"
        },
        "address": null
    },
    {
        "apc_id": "9bf2e075-2360-4456-8081-99bb31f71c5d",
        "name": "Thorton Oil and Company",
        "apc_op_id": {
            "id": "a45536f3-ac27-4f3b-9a70-b0bb536d9fc6",
            "name": "Thorton Oil and Company"
        },
        "address": null
    },
    {
        "apc_id": "03559b6a-a1c5-43b3-8623-78d9acf2697a",
        "name": "Denver Oil 2",
        "apc_op_id": {
            "id": "d0bc769a-b709-4d58-b563-acdf1d99c5a2",
            "name": "Denver Oil 2"
        },
        "address": {
            "id": 6,
            "zip": "98987",
            "city": "Houston",
            "state": "Texas",
            "suite": "",
            "street": "12344 XBox Lane",
            "country": "United States"
        }
    },
    {
        "apc_id": "3d721e36-a900-4506-a120-2be2793bb163",
        "name": "Denver Oil 2",
        "apc_op_id": {
            "id": "d0bc769a-b709-4d58-b563-acdf1d99c5a2",
            "name": "Denver Oil 2"
        },
        "address": {
            "id": 9,
            "zip": "80909",
            "city": "Dallas",
            "state": "Texas",
            "suite": "",
            "street": "5454",
            "country": "United States"
        }
    },
    {
        "apc_id": "f591cf12-2378-41c9-a8ac-e224e4a86e56",
        "name": "Thorton Oil and Company",
        "apc_op_id": {
            "id": "a45536f3-ac27-4f3b-9a70-b0bb536d9fc6",
            "name": "Thorton Oil and Company"
        },
        "address": null
    },
    {
        "apc_id": "996917a3-415a-4e9d-a7a9-c04c6050fd3f",
        "name": "Corr and Whit Oil Partner",
        "apc_op_id": {
            "id": "3b34a78a-13ad-40b5-aecd-268d56dd5e0d",
            "name": "Corr and Whit Oils Company"
        },
        "address": {
            "id": 42,
            "zip": "A",
            "city": "A",
            "state": "A",
            "suite": null,
            "street": "A",
            "country": "United States"
        }
    },
    {
        "apc_id": "2606ec4f-7849-41bc-8b3d-85d96f1c6948",
        "name": "Fortnite Oil",
        "apc_op_id": {
            "id": "f3f7d47d-bd77-41c7-8647-cb4b3761279c",
            "name": "Fortnite Oil"
        },
        "address": {
            "id": 14,
            "zip": "78789",
            "city": "Houton",
            "state": "Texas",
            "suite": "",
            "street": "5454 Louisian Blvs",
            "country": "United States"
        }
    },
    {
        "apc_id": "b8c3f719-b16e-4962-9580-c1e29360d6da",
        "name": "Corr and white",
        "apc_op_id": {
            "id": "3b34a78a-13ad-40b5-aecd-268d56dd5e0d",
            "name": "Corr and Whit Oils Company"
        },
        "address": null
    },
    {
        "apc_id": "ddbcfdb1-aa77-4f63-bffd-5941c116a5ab",
        "name": "Corr and white",
        "apc_op_id": {
            "id": "3b34a78a-13ad-40b5-aecd-268d56dd5e0d",
            "name": "Corr and Whit Oils Company"
        },
        "address": null
    },
    {
        "apc_id": "a6606212-9c6a-44b2-9a8c-a04e48ea6f1f",
        "name": "Third Wheel Oil and Gas",
        "apc_op_id": {
            "id": "8093e89f-85f1-4e24-ab91-a9df11e092f6",
            "name": "Third Wheel Oil and Gas"
        },
        "address": {
            "id": 15,
            "zip": "98700",
            "city": "Midland",
            "state": "Texas",
            "suite": "",
            "street": "3654 S Logan",
            "country": "United States"
        }
    },
    {
        "apc_id": "4045d710-476a-4ee0-b97b-be64933133ba",
        "name": "McKenzie Oil",
        "apc_op_id": {
            "id": "1beb7989-c65e-4c71-b68c-1a01b5e5850b",
            "name": "McKenzie Oil"
        },
        "address": {
            "id": 18,
            "zip": "87654",
            "city": "Denver",
            "state": "CO",
            "suite": "7",
            "street": "Kendall House Lane",
            "country": "United States"
        }
    },
    {
        "apc_id": "e21bc803-be42-47d5-ab2d-6fe85ed15659",
        "name": "McKenzie Oil Energy",
        "apc_op_id": {
            "id": "1beb7989-c65e-4c71-b68c-1a01b5e5850b",
            "name": "McKenzie Oil"
        },
        "address": {
            "id": 17,
            "zip": "87689",
            "city": "Dallas",
            "state": "Texas",
            "suite": "897600",
            "street": "98765 Kendall Ave",
            "country": "United States"
        }
    },
    {
        "apc_id": "8ed0a285-0011-4f56-962f-c46bc0889d1b",
        "name": "John Ross Exploration Inc",
        "apc_op_id": {
            "id": "1beb7989-c65e-4c71-b68c-1a01b5e5850b",
            "name": "McKenzie Oil"
        },
        "address": {
            "id": 10,
            "zip": "80113",
            "city": "Englewood",
            "state": "CO",
            "suite": "878",
            "street": "2900 S Emerson St",
            "country": "United States"
        }
    },
    {
        "apc_id": "626390b5-6f63-4caa-a0aa-b333a15eaf59",
        "name": "Athena Minerals Inc.",
        "apc_op_id": {
            "id": "3b34a78a-13ad-40b5-aecd-268d56dd5e0d",
            "name": "Corr and Whit Oils Company"
        },
        "address": {
            "id": 7,
            "zip": "80020",
            "city": "Denver",
            "state": "Colorado",
            "suite": "89",
            "street": "6767 Main lane",
            "country": "United States"
        }
    },
    {
        "apc_id": "77cea5bb-5adf-40d6-a945-9aef30dd3b69",
        "name": "Denver 3",
        "apc_op_id": {
            "id": "d0bc769a-b709-4d58-b563-acdf1d99c5a2",
            "name": "Denver Oil 2"
        },
        "address": {
            "id": 46,
            "zip": "00982",
            "city": "Houston",
            "state": "Texas",
            "suite": null,
            "street": "1564 S Street",
            "country": "United States"
        }
    },
    {
        "apc_id": "c99bacdd-8ee2-40b2-bbf2-2830a0b314d1",
        "name": "Third Wheel Energy Co.",
        "apc_op_id": {
            "id": "4482e4ea-29ad-4f57-a30a-d67a6b3d8ec1",
            "name": "This Third Wheel Oil and Gas"
        },
        "address": {
            "id": 16,
            "zip": "98765",
            "city": "Dallas",
            "state": "Texas",
            "suite": "3003",
            "street": "4367 Penn Ave",
            "country": "United States"
        }
    },
    {
        "apc_id": "a5d83b61-c2ea-4015-832b-9120ccf601af",
        "name": "Corr and Whit Oils Company",
        "apc_op_id": {
            "id": "3b34a78a-13ad-40b5-aecd-268d56dd5e0d",
            "name": "Corr and Whit Oils Company"
        },
        "address": null
    },
    {
        "apc_id": "db863d3c-606e-4fa6-b044-812d1f3cf6eb",
        "name": "Last Company",
        "apc_op_id": {
            "id": "3b34a78a-13ad-40b5-aecd-268d56dd5e0d",
            "name": "Corr and Whit Oils Company"
        },
        "address": {
            "id": 11,
            "zip": "80113",
            "city": "Englewood",
            "state": "CO",
            "suite": "1122",
            "street": "2900 S Emerson St",
            "country": "United States"
        }
    },
    {
        "apc_id": "9e96df60-9fa3-4330-8318-972504f1af66",
        "name": "Corr and White Oil Company",
        "apc_op_id": {
            "id": "3b34a78a-13ad-40b5-aecd-268d56dd5e0d",
            "name": "Corr and Whit Oils Company"
        },
        "address": {
            "id": 45,
            "zip": "89899",
            "city": "Houston",
            "state": "Texas",
            "suite": "5678",
            "street": "2121 Lane Blvc",
            "country": "United States"
        }
    },
    {
        "apc_id": "ecb2c585-9225-4957-98ce-d4315af4e47b",
        "name": "Whit and Corr Oils Company",
        "apc_op_id": null,
        "address": {
            "id": 48,
            "zip": "80202",
            "city": "Denver",
            "state": "CO",
            "suite": null,
            "street": "1875 Lawrence St",
            "country": "United States"
        }
    },
    {
        "apc_id": "ecb2c585-9225-4957-98ce-d4315af4654e",
        "name": "Whitaker Corry Oils Company",
        "apc_op_id": null,
        "address": {
            "id": 418,
            "zip": "80203",
            "city": "Denver",
            "state": "CO",
            "suite": null,
            "street": "183375 Lawrence Ave",
            "country": "United States"
        }
    }
];



