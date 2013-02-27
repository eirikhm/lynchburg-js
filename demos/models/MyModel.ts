/// <reference path='../../src/Model.ts' />


class MyModel extends Model {
    public definitions = {

        "id": {
            "label": "ID",
            "type": "integer",
            "defaultValue": null,
            "validators": [

            ]
        },
        "category_id": {
            "label": "Category ID",
            "type": "integer",
            "defaultValue": null,
            "validators": {
                "required": true,
                "numerical": {
                    "integerOnly": true
                }
            }
        },
        "note": {
            "label": "Note",
            "type": "string",
            "defaultValue": null,
            "validators": [

            ]
        }
    };
}