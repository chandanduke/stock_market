import React, { useState, useCallback, useEffect, useRef } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const Dashboard = () => {
  // URL of the node server 
  const url = "ws://127.0.0.1:8000"
  const gridRef = useRef();
  const [rowData, setRowData] = useState([]);


  // Websocket connection logic
  const { sendMessage, lastMessage, readyState } = useWebSocket(url);
  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  // Columns def
  const [columnDefs] = useState([
    { field: 'Tag1', sortable: true, filter: "agTextColumnFilter" },
    { field: 'Tag2', sortable: true, filter: "agTextColumnFilter" },
    { field: 'Tag3', sortable: true, filter: "agTextColumnFilter" },
    { field: 'Tag4', sortable: true, filter: "agTextColumnFilter" },
    { field: 'Tag5', sortable: true, filter: "agTextColumnFilter" },
    { field: 'Tag6', sortable: true, filter: "agTextColumnFilter" },
    { field: 'Metric1', sortable: true, filter: "agNumberColumnFilter" },
    { field: 'Metric2', sortable: true, filter: "agNumberColumnFilter" },
    { field: 'Metric3', sortable: true, filter: "agNumberColumnFilter" },
])

// Adding data to the grid
  useEffect(() => {
    if (lastMessage !== null) {
        const newRecord = JSON.parse(lastMessage.data);
        gridRef.current.api.applyTransaction({
          addIndex: 0,
          add: [newRecord]
        })
    }
  }, [lastMessage]);

  // As soon as user land on the page they should see latest update 
  useEffect(() => {sendMessage('Hello')},[]);
  const handleClickSendMessage = useCallback(() => sendMessage('Hello'), []);

// grid 

  return (
      <div className="ag-theme-alpine">
        <h1 style = {{ display: "flex", color: "green", justifyContent: "center"  }} >Live Dashboard</h1>
           <AgGridReact ref={gridRef}
               domLayout='autoHeight'
               pagination={true}
               enableCellChangeFlash = {true}
               rowData={rowData}
               columnDefs={columnDefs}>
           </AgGridReact>
       </div>
  );
};
export default Dashboard;