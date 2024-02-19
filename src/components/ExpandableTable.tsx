import * as React from "react";
import powerbi from "powerbi-visuals-api";
import DataView = powerbi.DataView;
import {useHeaderStyles} from "../hooks";
import ReactTooltip from 'react-tooltip'


interface ExpandableTableProps {
    data?: any[];
    dataView?: DataView; // Make sure to replace 'DataView' with the actual type of your 'dataView'
}

export const ExpandableTable: React.FC<ExpandableTableProps> = ({
                                                                    data,
                                                                    dataView = {} as DataView,
                                                                }) => {

    const [expandColumn, setExpandColumn] = React.useState([]);
    const headerStyles = useHeaderStyles(dataView);

    const tableColumns = dataView.table?.columns?.filter((col) => col.roles?.category) || []

    const handleClickExpand = (id) => () => {
        const set = new Set(expandColumn);
        if (set.has(id)) {
            set.delete(id)
        } else {
            set.add(id)
        }
        setExpandColumn(Array.from(set))
    }

    const renderTable = () => {
        const totalColumns = dataView.table?.columns.length;

        return data.map((item, index) => {
            const lastCategory = dataView.table?.columns.find(
                (col) => col.roles?.expandableColumn
            );
            const additionColContent =
                lastCategory && lastCategory.queryName
                    ? item[lastCategory.queryName]
                    : "";


            const isExpanded = expandColumn.indexOf(item.id) > -1;

            return (
                <React.Fragment key={index}>
                    <tr>
                        <td>
                            <button className='expand-button'
                                    onClick={handleClickExpand(item.id)}>{isExpanded ? '-' : '+'}</button>
                        </td>
                        {tableColumns.map((category) => (
                            <td key={category.index}>
                                {category !== lastCategory && category && category.queryName
                                    ? item[category.queryName]
                                    : ""}
                            </td>
                        ))}
                    </tr>
                    <tr className={`addition-row ${isExpanded ? '' : 'hidden'}`}>
                        <td colSpan={totalColumns}>
                            <p dangerouslySetInnerHTML={{__html: additionColContent}}></p>
                        </td>
                    </tr>
                </React.Fragment>
            );
        });
    };

    return <table>
        <thead>
        <tr>
            {/*@ts-ignore*/}
            <th style={headerStyles}></th>
            {tableColumns.filter((col) => col.roles?.category)
                .map((category) => (
                    // @ts-ignore
                    <th  style={headerStyles} key={category.index}>
                        <ReactTooltip place="top" id={`tool-tip-header-${category.index}`}>
                            {category.displayName}
                        </ReactTooltip>
                        <span data-tip="React-tooltip" data-for={`tool-tip-header-${category.index}`}>{category.displayName}</span>
                    </th>
                ))}
        </tr>
        </thead>

        {renderTable()}
    </table>
};
