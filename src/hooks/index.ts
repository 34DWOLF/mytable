import powerbi from "powerbi-visuals-api";
import DataView = powerbi.DataView;
import * as React from "react";
import {useEffect} from "react";

export const useHeaderStyles = (dataView: DataView) => {
    const [headerStyles, setHeaderStyles] = React.useState({
        fontFamily: "Segoe UI",
        fontSize: '14px',
        fontStyle: 'inherit',
        textDecoration: 'inherit',
        textAlign: 'inherit',
        color: 'white',
        fontWeight: 'normal',
        backgroundColor : 'black'
    });

    useEffect(() => {
        const tableHeader = dataView.metadata?.objects?.tableHeader;
        if (!tableHeader) {
            return
        }
        const styles = {...headerStyles}
        styles.fontStyle = tableHeader.fontItalic ? 'italic' : 'inherit'
        styles.fontFamily = tableHeader.fontFamily + '';
        styles.fontSize = `${tableHeader.fontSize}px`;
        styles.textDecoration = tableHeader.fontUnderline ? 'underline' : 'inherit';
        styles.textAlign = tableHeader.lineAlignment + '';
        styles.fontWeight = tableHeader.fontBold ? 'bold' : 'normal';
        styles.color = tableHeader.textColor ? tableHeader.textColor['solid']['color'] : 'white';
        styles.backgroundColor = tableHeader.backgroundColor ? tableHeader.backgroundColor['solid']['color'] : 'black';
        setHeaderStyles(styles);

    }, [dataView.metadata])

    return headerStyles;
}
