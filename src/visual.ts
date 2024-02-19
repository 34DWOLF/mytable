/* eslint-disable powerbi-visuals/no-inner-outer-html */
"use strict";

import "./../style/visual.less";
import powerbi from "powerbi-visuals-api";
import {createElement} from "react";
import * as ReactDOM from "react-dom";
import {ExpandableTable} from './components/ExpandableTable'
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import DataView = powerbi.DataView;

export class Visual implements IVisual {

    private target: HTMLElement;
    constructor(options: VisualConstructorOptions) {
        this.target = options.element;
    }

    public update(options: VisualUpdateOptions) {
        // this.visualSettings = this.formattingSettingsService.populateFormattingSettingsModel(VisualSettings, options.dataViews[0]);
        const dataView = options.dataViews[0];
        console.log(dataView);
        const data = this.getTableData(dataView);
        ReactDOM.render(createElement(ExpandableTable, {
            data, dataView
        }), this.target);
    }

    private getTableData = (dataView: DataView) => {
        const rows = [];
        const values = dataView.table.rows;
        const totalRows = values.length;
        for (let i = 0; i < totalRows; i++) {
            const data = {};
            dataView.table.columns.forEach((col) => {
                data[col.queryName] = values[i][col.index]
                data['id'] = i;
            })
            rows.push(data);
        }
        return rows;
    }

    public getFormattingModel(): powerbi.visuals.FormattingModel {
        // Building data card, We are going to add two formatting groups "Font Control Group" and "Data Design Group"
        let tableFormat: powerbi.visuals.FormattingCard = {
            description: "Table Format",
            displayName: "Table Format",
            uid: "tableFormat",
            groups: []
        }

        let tableHeaderGroup: powerbi.visuals.FormattingGroup = {
            displayName: "Table Header",
            uid: "dataCard_fontControl_group_uid",
            slices: [
                {
                    uid: "data_font_control_slice_uid",
                    displayName: "Font",
                    control: {
                        type: powerbi.visuals.FormattingComponent.FontControl,
                        properties: {
                            fontFamily: {
                                descriptor: {
                                    objectName: "tableHeader",
                                    propertyName: "fontFamily"
                                },
                                value: "Segoe UI"
                            },
                            fontSize: {
                                descriptor: {
                                    objectName: "tableHeader",
                                    propertyName: "fontSize"
                                },
                                value: 14
                            },
                            bold: {
                                descriptor: {
                                    objectName: "tableHeader",
                                    propertyName: "fontBold"
                                },
                                value: false
                            },
                            italic: {
                                descriptor: {
                                    objectName: "tableHeader",
                                    propertyName: "fontItalic"
                                },
                                value: false
                            },
                            underline: {
                                descriptor: {
                                    objectName: "tableHeader",
                                    propertyName: "fontUnderline"
                                },
                                value: false
                            }
                        }
                    }
                },
                {
                    displayName: "Text Color",
                    uid: "dataCard_dataDesign_fontColor_slice",
                    control: {
                        type: powerbi.visuals.FormattingComponent.ColorPicker,
                        properties: {
                            descriptor:
                                {
                                    objectName: "tableHeader",
                                    propertyName: "textColor"
                                },
                            value: { value: "#ffffff" }
                        }
                    }
                },
                {
                    displayName: "Background Color",
                    uid: "dataCard_dataDesign_background_slice",
                    control: {
                        type: powerbi.visuals.FormattingComponent.ColorPicker,
                        properties: {
                            descriptor:
                                {
                                    objectName: "tableHeader",
                                    propertyName: "backgroundColor"
                                },
                            value: { value: "#1e1e1e" }
                        }
                    }
                },
                {
                    displayName: "Text Alignment",
                    uid: "dataCard_dataDesign_lineAlignment_slice",
                    control: {
                        type: powerbi.visuals.FormattingComponent.AlignmentGroup,
                        properties: {
                            descriptor:
                                {
                                    objectName: "tableHeader",
                                    propertyName: "lineAlignment"
                                },
                            mode: powerbi.visuals.AlignmentGroupMode.Horizonal,
                            value: "left"
                        }
                    }
                },
            ],
        };


        // Add formatting groups to data card
        tableFormat.groups.push(tableHeaderGroup);

        // Build and return formatting model with data card
        return {cards: [tableFormat]};
    }
}
