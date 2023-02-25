import React, { useState, useCallback, useEffect, useRef } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const Dashboard = () => {
  const url = "ws://127.0.0.1:8000"
  const gridRef = useRef();
  const [rowData, setRowData] = useState([]);
  const { sendMessage, lastMessage, readyState } = useWebSocket(url);
  const [columnDefs] = useState([
    { field: 'Tag1', sortable: true, filter: "agTextColumnFilter" },
    { field: 'Tag2', sortable: true, filter: "agTextColumnFilter" },
    { field: 'Tag3', sortable: true, filter: "agTextColumnFilter" },
    { field: 'Metric1', sortable: true, filter: "agNumberColumnFilter" },
    { field: 'Metric2', sortable: true, filter: "agNumberColumnFilter" }
])
  useEffect(() => {
    if (lastMessage !== null) {
        const newRecord = JSON.parse(lastMessage.data);
        gridRef.current.api.applyTransaction({
          addIndex: 0,
          add: [newRecord]
        })
        // const updatedRowData = [newRecord, ...rowData];
        // setRowData(updatedRowData);
    }
  }, [lastMessage]);

  useEffect(() => {sendMessage('Hello')},[]);
  const handleClickSendMessage = useCallback(() => sendMessage('Hello'), []);

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];


  return (
      <div className="ag-theme-alpine" style={{width: 1000}}>
           <AgGridReact ref={gridRef}
               domLayout='autoHeight'
               enableCellChangeFlash = {true}
               rowData={rowData}
               columnDefs={columnDefs}>
           </AgGridReact>
       </div>
  );
};
export default Dashboard;