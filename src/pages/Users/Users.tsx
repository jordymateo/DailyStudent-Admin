import React, { useEffect, useState } from "react";
import TabPanel, { Item as TabItem } from 'devextreme-react/tab-panel';
import { useHistory } from "react-router-dom";
import { IAdminSectionProps, IStudentsSectionProps } from "./types";
import { Button, DataGrid } from "devextreme-react";
import { Column, FilterRow, HeaderFilter, Pager, Paging } from "devextreme-react/data-grid";
import { UsersService } from "../../services";
import { User } from "../../models";
import { ConfirmationPopup } from "../../components/ConfirmationPopup";
import notify from "devextreme/ui/notify";
import CreateAdmin from "./CreateAdmin";


const StudentsSection: React.FC<IStudentsSectionProps> = ({ tabIndex, data, onDataChanged }) => {
  const [itemSelected, setItemSelected] = useState<Partial<User>>({});
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);

  const onSubmit = () => {
    setOpenConfirm(false);
    setItemSelected({});
    UsersService.toggleState(itemSelected.id!)
      .then((data) => {
        onDataChanged();
        notify({ message: `Usuario ${(itemSelected && itemSelected.state == 'Activo') ? 'inactivado' : 'activado'} correctamente!`, width: 'auto' }, "success", 4500);
      }).catch((response: any) => {
        notify({ message: response.data.errors, width: 'auto' }, "error", 4500);
      });
  }

  return (
    <div className="tab-section-container">
      <div style={{ width: '95%', alignSelf: 'center', paddingTop: '10px', textAlign: 'right', marginBottom: '10px' }}>
        <Button
          text={(itemSelected && itemSelected.state == 'Activo') ? 'INACTIVAR' : 'ACTIVAR'}
          height="40px"
          stylingMode={'text'}
          type={(itemSelected && itemSelected.state == 'Activo') ? 'danger' : 'success'}
          disabled={!itemSelected}
          onClick={() => setOpenConfirm(true)}
        />
      </div>
      <div style={{ width: '95%', maxWidth: 'fit-content', alignSelf: 'center' }}>
        <DataGrid
          dataSource={data}
          width="100%"
          showBorders={false}
          selection={{ mode: 'single' }}
          keyExpr="id"
          selectedRowKeys={itemSelected ? [itemSelected.id] : undefined}
          onSelectionChanged={({ selectedRowsData }) => {
            if (selectedRowsData)
              setItemSelected(selectedRowsData[0])
          }}
        // remoteOperations={true}
        >
          <Paging defaultPageSize={5} />
          <Pager
            showPageSizeSelector={true}
            allowedPageSizes={[5, 10, 20]}
            showInfo={true} />
          <FilterRow visible />
          <Column
            caption="E-mail"
            dataField="email"
            dataType="string"
          >
            <HeaderFilter allowSearch={true} />
          </Column>
          <Column
            dataField="name"
            caption="Nombre"
            dataType="string"
          />
          <Column
            dataField="lastName"
            caption="Apellido"
            dataType="string"
          />
          <Column
            dataField="creationDate"
            caption="Fecha de creación"
            dataType="date"
          />
          <Column
            dataField="state"
            caption="Estado"
            dataType="string"
          />
        </DataGrid>
      </div>
      <ConfirmationPopup
        okText="Si"
        cancelText="No"
        message={`El usuario seleccionado se ${(itemSelected && itemSelected.state == 'Activo') ? 'inactivará' : 'activará'}. ¿Desea continuar?`}
        open={openConfirm}
        onOk={onSubmit}
        onCancel={() => setOpenConfirm(false)}
      />
    </div >
  );
}

const AdminSection: React.FC<IAdminSectionProps> = ({ tabIndex, data, onDataChanged }) => {

  var [createAdminVisible, setCreateAdminVisible] = useState<boolean>(false);

  return (
    <div className="tab-section-container">
      <div style={{ width: '95%', alignSelf: 'center', paddingTop: '10px', textAlign: 'right', marginBottom: '10px' }}>
        <Button
          text={'AGREGAR'}
          height="40px"
          stylingMode={'text'}
          onClick={() => setCreateAdminVisible(true)}
        />
      </div>
      <div style={{ width: '95%', maxWidth: 'fit-content', alignSelf: 'center' }}>
        <DataGrid
          dataSource={data}
          width="100%"
          showBorders={false}
          selection={{ mode: 'single' }}
          keyExpr="id"
        // remoteOperations={true}
        >
          <Paging defaultPageSize={5} />
          <Pager
            showPageSizeSelector={true}
            allowedPageSizes={[5, 10, 20]}
            showInfo={true} />
          <FilterRow visible />
          <Column
            caption="E-mail"
            dataField="email"
            dataType="string"
          >
            <HeaderFilter allowSearch={true} />
          </Column>
          <Column
            dataField="name"
            caption="Nombre"
            dataType="string"
          />
          <Column
            dataField="lastName"
            caption="Apellido"
            dataType="string"
          />
          <Column
            dataField="creationDate"
            caption="Fecha de creación"
            dataType="date"
          />
          <Column
            dataField="state"
            caption="Estado"
            dataType="string"
          />
        </DataGrid>
      </div>
      <CreateAdmin
        visible={createAdminVisible}
        onHidden={() => setCreateAdminVisible(false)}
        onDataChanged={onDataChanged}
      />
    </div >
  );
}

const Users: React.FC = () => {

  var history = useHistory();
  var [tabIndex, setTabIndex] = useState<number>(0);
  var [students, setStudents] = useState<User[]>([]);
  var [admins, setAdmins] = useState<User[]>([]);

  const studentsRefresh = () => {
    UsersService.getStudents().then(data => setStudents(data));
  };

  const adminsRefresh = () => {
    UsersService.getAdmins().then(data => setAdmins(data));
  };

  useEffect(() => {
    studentsRefresh();
    adminsRefresh();
  }, []);


  var onSelectionTabChanged = (args: any) => {
    if (args.name == 'selectedIndex') {
      setTabIndex(args.value);
    }
  }



  return (
    <div className="course-section">
      <div className="course-section-header">
        <h1>Usuarios</h1>
      </div>
      <div style={{ marginTop: '4em', flexGrow: 1 }}>
        <TabPanel
          selectedIndex={tabIndex}
          onOptionChanged={onSelectionTabChanged}
          focusStateEnabled={false}
          className="ds-tab-panel"
          height="100%"
        >
          <TabItem title="Estudiantes">
            <StudentsSection
              tabIndex={tabIndex}
              data={students}
              onDataChanged={studentsRefresh}
            />
          </TabItem>
          <TabItem title="Administradores">
            <AdminSection
              tabIndex={tabIndex}
              data={admins}
              onDataChanged={adminsRefresh}
            />
          </TabItem>

        </TabPanel>
      </div>
    </div>
  );
}
export default Users;