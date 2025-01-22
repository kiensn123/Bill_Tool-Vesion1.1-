import React, { useState,useEffect,useRef } from 'react';
import { Container, Row, Col, Button, Table, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as XLSX from 'xlsx'; // Import thư viện xlsx

// Component hiển thị bảng
// Component hiển thị bảng
function Hien_Thi_Bang({ dauvao }) {
  const { tableData, setTableData } = dauvao;

  // Các cột (keys) của bảng
  const columns = [
    "CUSTOMER'S NAME", "PHONE", "ADDRESS", "Note", "Product", "OPTIONE", "SIZE", "Price", "STATUS", "Pay", "Shipping unit","TrangThai_Bill"  
  ];

  // Hàm xử lý khi người dùng thay đổi giá trị trong một ô
  const handleCellChange = (e, rowIndex, colName) => {
    const newTableData = [...tableData]; // Tạo một bản sao của mảng tableData
    newTableData[rowIndex][colName] = e.target.value; // Cập nhật giá trị của ô đã thay đổi
    setTableData(newTableData); // Cập nhật lại state
  };

  function findSlashPositions(soString) {
    const positions = [];
    for (let i = 0; i < soString.length; i++) {
      if (soString[i] === '/') {
        positions.push(i); // Thêm vị trí của ký tự '/' vào mảng
      }
    }
    return positions;
  }

  useEffect(() => {
    const updatedData = tableData.map((row) => {
      if (row["PHONE"]) {
        let soString = row["PHONE"].toString(); // Chuyển số điện thoại thành chuỗi
        soString = soString.replace(/\s+/g, '');
        if (soString.length>9){
          const positions = findSlashPositions(soString);
          var vitridau   // Lấy vị trí đầu tiên
          var vitricuoi 
          if(positions.length>0 ){
            if (positions.length<2){
              vitridau = positions[0];
              vitricuoi =  positions[0];
            }else{
              vitridau = positions[0];
              vitricuoi =positions[positions.length - 1]; 
            }
            var cat_chu_dau = soString.slice(0,vitridau)
            var cat_chu_dau_cuoi = soString.slice(vitricuoi+1)
            soString = cat_chu_dau;
            row["ADDRESS"] += " (" +cat_chu_dau_cuoi+") "
          }
          
        }

        if(isNaN(soString)){
          return { ...row,  soString };
        }

        if (soString.length === 7 && !soString.startsWith("030")) {
          return { ...row, PHONE: "030 " + soString };
        } else if (soString.length === 8 && !soString.startsWith("020")) {
          return { ...row, PHONE: "020 " + soString };
        }else if(soString.length >=9){
          if (soString.startsWith("30")){
              var so_new = soString.slice(2)
              soString =  so_new;
              return { ...row, PHONE: "030 " + soString };
          }
          if (soString.startsWith("20")){
            var so_new = soString.slice(2)
            soString =  so_new;
            return { ...row, PHONE: "020 " + soString };
        }

        }
      }
      return row; // Không thay đổi nếu không cần
    });

    // Chỉ cập nhật nếu dữ liệu thực sự thay đổi
    if (JSON.stringify(updatedData) !== JSON.stringify(tableData)) {
      setTableData(updatedData); // Cập nhật lại dữ liệu
    }
  }, [tableData, setTableData]); // Chỉ chạy khi tableData hoặc setTableData thay đổi



  return (
    <Row className="my-3">
      <Col>
        {tableData.length > 0 && (
          <Table striped bordered hover className="mt-3">
            <thead>
              <tr>
                {columns.map((col, index) => (
                  <th key={index}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((col, colIndex) => {
                    let cellValue = row[col] || ""; // Lấy giá trị của ô, mặc định là rỗng nếu không có dữ liệu
                    let cellStyle = {}; // Khởi tạo style cho mỗi ô

    
                    // Nếu ô trống, tô màu vàng
                    if (cellValue === "") {
                      cellStyle = { backgroundColor: "yellow" };
                    }

                    // Nếu ô "Phone" (cột index 1) không phải là số, tô màu đỏ
                    if (col === "PHONE" ) {
                      cellValue = cellValue.toString();
                      if(cellValue.slice(0,3)==="030"){
                          var doithanhso = isNaN(cellValue.slice(3))
                          if (doithanhso){
                            cellStyle = { ...cellStyle, backgroundColor: "red" };
                          }else{
                            if (Number(cellValue.slice(3)).toString().length !=7){
                            
                              cellStyle = { ...cellStyle, backgroundColor: "red" };
                            }else{
                              cellStyle = { ...cellStyle, backgroundColor: "lightgreen" };
                            }
                     
                          }
                    

                      }else if(cellValue.slice(0,3)==="020"){
                          var doithanhso = isNaN(cellValue.slice(3))
                          if (doithanhso){
                            cellStyle = { ...cellStyle, backgroundColor: "red" };
                          }else{
                            if (Number(cellValue.slice(3)).toString().length !=8){
                              cellStyle = { ...cellStyle, backgroundColor: "red" };
                            }else{
                              cellStyle = { ...cellStyle, backgroundColor: "#009a68" };
                            }
                     
                          }
                      }else{
                        cellStyle = { ...cellStyle, backgroundColor: "red" };
                      }
                     
                      // var so_String = cellValue.toString()
                      // if (so_String.length ==7){
                       
                      //   // cellValue = "030 "+so_String
                      // }else if(so_String.length ==8){
                      
                      //   // cellValue = "020 "+so_String
                      // }else if(so_String.length <7){
                      //   cellStyle = { ...cellStyle, backgroundColor: "red" };
                      // }else if(so_String.length >8){
                      //     var new_num = so_String.slice(0,3)
                      //     if(new_num ==="030" ||  new_num ==="020"){
                      //         cellValue = Number(so_String.slice(3))
                      //         cellStyle = { ...cellStyle, backgroundColor: "purple" };
                      //         tableData[rowIndex][col] = cellValue;
                      //         setTableData([...tableData]);
                      //     }else {
                      //       var new_num1 = so_String.slice(0,2)
                      //       if(new_num1 ==="30" ||  new_num1 ==="20"){
                      //         cellValue = Number(so_String.slice(2))
                      //         cellStyle = { ...cellStyle, backgroundColor: "purple" };
                      //         tableData[rowIndex][col] = cellValue;
                      //         setTableData([...tableData]);
                      //       }else{
                      //         cellStyle = { ...cellStyle, backgroundColor: "red" };
                      //       }
                      //     }
                          
                      // }
                      // ThayDoiSoDienThoai(cellValue,rowIndex,col)
                      // tableData[rowIndex][col] = cellValue;
                      // setTableData([...tableData]);
                      




                  
                    }

                    if (col === "Shipping unit"){
                      if (cellValue ===""){
                        cellStyle = { ...cellStyle, backgroundColor: "red" };
                      }
                    }

                    if (col === "STATUS"){
                      if (cellValue ==="OK"){
                        cellStyle = { ...cellStyle, backgroundColor: "green" };
                      }else if (cellValue ==="Cancel"){
                        cellStyle = { ...cellStyle, backgroundColor: "pink" };
                      }else if (cellValue ===""){
                        cellStyle = { ...cellStyle, backgroundColor: "white" };
                      }else{
                        cellStyle = { ...cellStyle, backgroundColor: "red" };
                      }
                 

                    }

                    if (col === "Pay"){
                      if (cellValue ==="Delivery"){
                        cellStyle = { ...cellStyle, backgroundColor: "blue" };
                      }else if (cellValue ===""){
                        cellStyle = { ...cellStyle, backgroundColor: "white" };
                      }else{
                        cellStyle = { ...cellStyle, backgroundColor: "red" };
                      }
                    }


                    if (col === "TrangThai_Bill"){
                        if (cellValue ===""){
                          cellStyle = { ...cellStyle, backgroundColor: "green" };
                        }else{
                          cellStyle = { ...cellStyle, backgroundColor: "red" };
                        }
  
                        return (
                          <td key={colIndex} style={cellStyle}>
                      
                              
                            <Form.Select  value={cellValue}  onChange={(e) => handleCellChange(e, rowIndex, col)} aria-label="Default select example">
                                <option  value="">Có</option>
                                <option value="N">Không</option>
                            </Form.Select>
                            
                          </td>
                        );
                    }

                    if(col =="SIZE"){
                      if (cellValue ===""){
                        cellStyle = { ...cellStyle, backgroundColor: "#f4f1d2" };
                      }
                    }
                    

                    return (
                      <td key={colIndex} style={cellStyle}>
                   
                          
                
                        <input
                          type="text"
                          value={cellValue}
                          onChange={(e) => handleCellChange(e, rowIndex, col)} // Gọi hàm khi người dùng thay đổi giá trị
                          className="form-control"
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  );
}

// Component nhập dữ liệu
function Input({ dauvao }) {
  const { setTableData } = dauvao;
  const [inputText, setInputText] = useState('');
  const [inputMethod, setInputMethod] = useState('googleSheets'); // Thêm state chọn phương thức nhập liệu

  // Các cột (keys) của bảng
  const columns = [
    "CUSTOMER'S NAME", "PHONE", "ADDRESS", "Note", "Product", "OPTIONE", "SIZE", "Price", "STATUS", "Pay", "Shipping unit","TrangThai_Bill"  
  ];

  // Hàm xử lý khi dán nội dung vào Textarea
  const handleInputChange = (e) => {
    const input = e.target.value;
    setInputText(input);

    // Chuyển đổi dữ liệu thành mảng ngay lập tức, giữ ô trống
    const rows = input.trim().split('\n').map(row => {
      const columnsArray = row.split('\t');  // Chia cột dựa trên dấu tab (Google Sheets sử dụng tab để phân cách các ô)
      
      // Chuyển thành đối tượng với các khóa là tên cột
      const rowObj = {};
      columns.forEach((col, index) => {
        rowObj[col] = columnsArray[index] || "";  // Nếu ô trống, thay thế bằng một chuỗi rỗng
      });

      return rowObj;
    });

    setTableData(rows);
  };

  // Hàm xử lý khi chọn file Excel
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const binaryStr = event.target.result;
        const workbook = XLSX.read(binaryStr, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Lấy phạm vi của sheet (range)
        const range = XLSX.utils.decode_range(worksheet['!ref']); 
        const rows = [];

        // Duyệt qua tất cả các dòng trong phạm vi để lấy tất cả các ô, bao gồm ô trống
        for (let rowIndex = range.s.r; rowIndex <= range.e.r; rowIndex++) {
          const row = {};
          let hasData = false; // Biến kiểm tra dòng có dữ liệu hay không

          for (let colIndex = range.s.c; colIndex <= range.e.c; colIndex++) {
            const cell = worksheet[XLSX.utils.encode_cell({ r: rowIndex, c: colIndex })];
            const cellValue = cell ? cell.v : "";

            row[columns[colIndex]] = cellValue;

            // Nếu có dữ liệu trong ô, đánh dấu là dòng có dữ liệu
            if (cellValue !== "") {
              hasData = true;
            }
          }

          // Chỉ thêm dòng nếu có ít nhất một ô có dữ liệu
          if (hasData) {
            rows.push(row);
          }
        }

        // Cập nhật state chỉ với các dòng có dữ liệu
        setTableData(rows);
      };
      reader.readAsBinaryString(file);
    }
  };

  return (
    <>
      <Row className="my-3">
        <Col>
          <h1>Chọn phương thức nhập liệu</h1>
          <Form.Group controlId="selectInputMethod">
            <Form.Label>Chọn nhập từ:</Form.Label>
            <Form.Control
              as="select"
              value={inputMethod}
              onChange={(e) => setInputMethod(e.target.value)}
            >
              <option value="googleSheets">Google Sheets</option>
              <option value="excel">Excel File</option>
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>

      {inputMethod === 'googleSheets' && (
        <Row className="my-3">
          <Col>
            <h1>Nhập bảng từ Google Sheets</h1>
            <Form>
              <Form.Group controlId="formFileInput">
                <Form.Label>Dán bảng từ Google Sheets vào dưới đây:</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={10} 
                  value={inputText} 
                  onChange={handleInputChange}
                  placeholder="Dán bảng vào đây..."
                />
              </Form.Group>
            </Form>
          </Col>
        </Row>
      )}

      {inputMethod === 'excel' && (
        <Row className="my-3">
          <Col>
            <h1>Nhập từ file Excel</h1>
            <Form.Group controlId="formFileUpload">
              <Form.Label>Chọn file Excel để tải lên:</Form.Label>
              <Form.Control 
                type="file" 
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
              />
            </Form.Group>
          </Col>
        </Row>
      )}
    </>
  );
}


// Component chính kết nối các thành phần
function NhapFile() {
  const [tableData, setTableData] = useState([]);
  console.log(tableData)
  return (
    <>
 
        <Input dauvao={{ setTableData }} />
        <Hien_Thi_Bang dauvao={{ tableData,setTableData }} />  
  
    </>
  );
}

export default NhapFile;
