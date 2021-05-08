import React, { useEffect, useState } from 'react';
import TabPanel, { Item as TabItem } from 'devextreme-react/tab-panel';
import { ICareersSectionProps, IPensumsSectionProps } from './types';
import { Button, DataGrid } from "devextreme-react";
import { Column, FilterRow, HeaderFilter, Pager, Paging } from "devextreme-react/data-grid";
import { Career, Institution, Pensum } from '../../models';
import { CareersService, InstitutionsService, PensumsService } from '../../services';
import CreateCareer from './CreateCareer';
import { ConfirmationPopup } from '../../components/ConfirmationPopup';
import notify from 'devextreme/ui/notify';
import CreatePensum from './CreatePensum';
import { useHistory } from 'react-router-dom';

const CareersSection: React.FC<ICareersSectionProps> = ({ data, tabIndex, institutions, onDataChanged }) => {
  const [itemSelected, setItemSelected] = useState<Partial<Career>>({});
  var [createVisible, setCreateVisible] = useState<boolean>(false);
  const [openApproveConfirm, setOpenApproveConfirm] = useState<boolean>(false);

  const onApprove = () => {
    setOpenApproveConfirm(false);
    setItemSelected({});
    CareersService.approve(itemSelected.id!)
      .then((data) => {
        onDataChanged();
        notify({ message: 'Carrera aprobada correctamente!', width: 'auto' }, "success", 4500);
      }).catch((response: any) => {
        notify({ message: response.data.errors, width: 'auto' }, "error", 4500);
      });
  }

  return (
    <div className="tab-section-container">
      <div style={{ width: '95%', alignSelf: 'center', paddingTop: '10px', textAlign: 'right', marginBottom: '10px' }}>
        <Button
          text={'AGREGAR'}
          height="40px"
          stylingMode={'text'}
          onClick={() => {
            setItemSelected({});
            setCreateVisible(true);
          }}
        />
        <Button
          text={'EDITAR'}
          height="40px"
          stylingMode={'text'}
          disabled={!itemSelected}
          type="default"
          onClick={() => {
            setCreateVisible(true);
          }}
        />
        <Button
          text={'APROBAR'}
          height="40px"
          stylingMode={'text'}
          type={'success'}
          disabled={!itemSelected || itemSelected.state == 'Aprobado'}
          onClick={() => setOpenApproveConfirm(true)}
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
        >
          <Paging defaultPageSize={5} />
          <Pager
            showPageSizeSelector={true}
            allowedPageSizes={[5, 10, 20]}
            showInfo={true} />
          <FilterRow visible />

          <Column
            dataField="name"
            caption="Nombre"
            dataType="string"
          />
          <Column
            dataField="institutionName"
            caption="Institución"
            dataType="string"
            lookup={{
              dataSource: institutions,
              displayExpr: 'name',
              valueExpr: 'name'
            }}
          />
          <Column
            dataField="isPensumAvailable"
            caption="Tiene pensum"
            dataType="boolean"
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
        message={`La carrera seleccionada será aprobada. ¿Desea continuar?`}
        open={openApproveConfirm}
        onOk={onApprove}
        onCancel={() => setOpenApproveConfirm(false)}
      />
      <CreateCareer
        data={itemSelected ? {
          id: itemSelected.id!,
          name: itemSelected.name!,
          institutionId: itemSelected.institutionId!,
          pensum: []
        } : undefined}
        visible={createVisible}
        onHidden={() => {
          setCreateVisible(false);
        }}
        onDataChanged={onDataChanged}
      />
    </div>
  );
}

const PensumsSection: React.FC<IPensumsSectionProps> = ({ data, institutions, careers, tabIndex, onDataChanged }) => {

  const history = useHistory();
  const [itemSelected, setItemSelected] = useState<Partial<Pensum>>({});
  var [createVisible, setCreateVisible] = useState<boolean>(false);

  const [openStateConfirm, setOpenStateConfirm] = useState<boolean>(false);
  const [openApproveConfirm, setOpenApproveConfirm] = useState<boolean>(false);

  const onStateChangeClick = () => {
    if (itemSelected) {
      if (itemSelected.isApproved) {
        setOpenStateConfirm(true);
      } else {
        setOpenApproveConfirm(true);
      }
    }
  }
  const onTonggleState = () => {
    setOpenStateConfirm(false);
    setItemSelected({});
    PensumsService.toggleState(itemSelected.id!)
      .then((data) => {
        onDataChanged();
        notify({ message: `Pensum ${(itemSelected && !itemSelected.isDeleted) ? 'inactivado' : 'activado'} correctamente!`, width: 'auto' }, "success", 4500);
      }).catch((response: any) => {
        notify({ message: response.data.errors, width: 'auto' }, "error", 4500);
      });
  }

  const onApprove = () => {
    setOpenApproveConfirm(false);
    setItemSelected({});
    PensumsService.approve(itemSelected.id!)
      .then((data) => {
        onDataChanged();
        notify({ message: 'Pensum aprobado correctamente!', width: 'auto' }, "success", 4500);
      }).catch((response: any) => {
        notify({ message: response.data.errors, width: 'auto' }, "error", 4500);
      });
  }

  return (
    <div className="tab-section-container">
      <div style={{ width: '95%', alignSelf: 'center', paddingTop: '10px', textAlign: 'right', marginBottom: '10px' }}>
        <Button
          text={'AGREGAR'}
          height="40px"
          stylingMode={'text'}
          onClick={() => {
            setItemSelected({});
            setCreateVisible(true);
          }}
        />
        <Button
          text={'EDITAR'}
          height="40px"
          stylingMode={'text'}
          disabled={!itemSelected}
          type="default"
          onClick={() => {
            setCreateVisible(true);
          }}
        />
        <Button
          text={(itemSelected && !itemSelected.isApproved) ? 'APROBAR' : (itemSelected && itemSelected.isDeleted) ? 'ACTIVAR' : 'INACTIVAR'}
          height="40px"
          stylingMode={'text'}
          type={(itemSelected && !itemSelected.isApproved) ? 'success' : (itemSelected && itemSelected.isDeleted) ? 'success' : 'danger'}
          disabled={!itemSelected}
          onClick={onStateChangeClick}
        />
        <Button
          text={'GESTIONAR'}
          height="40px"
          stylingMode={'text'}
          disabled={!itemSelected}
          onClick={() => {
            history.push(`/pensum/${itemSelected.id}`);
          }}
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
        >
          <Paging defaultPageSize={5} />
          <Pager
            showPageSizeSelector={true}
            allowedPageSizes={[5, 10, 20]}
            showInfo={true} />
          <FilterRow visible />

          <Column
            dataField="name"
            caption="Nombre"
            dataType="string"
          />
          <Column
            dataField="institutionName"
            caption="Institución"
            dataType="string"
            lookup={{
              dataSource: institutions,
              displayExpr: 'name',
              valueExpr: 'name'
            }}
          />
          <Column
            dataField="careerName"
            caption="Carrera"
            dataType="string"
            lookup={{
              dataSource: careers,
              displayExpr: 'name',
              valueExpr: 'name'
            }}
          />
          <Column
            dataField="creditLimitPerPeriod"
            caption="Limite de creditos por periodo"
            dataType="number"
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
        message={`El pensum seleccionado se ${(itemSelected && !itemSelected.isDeleted) ? 'inactivará' : 'activará'}. ¿Desea continuar?`}
        open={openStateConfirm}
        onOk={onTonggleState}
        onCancel={() => setOpenStateConfirm(false)}
      />
      <ConfirmationPopup
        okText="Si"
        cancelText="No"
        message={`El pensum seleccionado será aprobada. ¿Desea continuar?`}
        open={openApproveConfirm}
        onOk={onApprove}
        onCancel={() => setOpenApproveConfirm(false)}
      />
      <CreatePensum
        data={itemSelected ? {
          id: itemSelected.id!,
          name: itemSelected.name!,
          creditLimitPerPeriod: itemSelected.creditLimitPerPeriod!,
          careerId: { id: itemSelected.carrerId! },
          pensum: []
        } : undefined}
        visible={createVisible}
        onHidden={() => {
          setCreateVisible(false);
        }}
        onDataChanged={onDataChanged}
      />
    </div>
  );
}

const Careers: React.FC = () => {

  //var history = useHistory();
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [careers, setCareers] = useState<Career[]>([]);
  const [pensums, setPensums] = useState<Pensum[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);

  const careersRefresh = () => {
    CareersService.getAll().then(data => setCareers(data));
  };

  const pensumsRefresh = () => {
    PensumsService.getAll().then(data => setPensums(data));
  };

  useEffect(() => {
    careersRefresh();
    pensumsRefresh();
    InstitutionsService.getAll().then(data => setInstitutions(data));
  }, []);


  const onSelectionTabChanged = (args: any) => {
    if (args.name == 'selectedIndex') {
      setTabIndex(args.value);
    }
  }

  return (
    <div className="course-section">
      <div className="course-section-header">
        <h1>Carreras y Pensums</h1>
      </div>
      <div style={{ marginTop: '4em', flexGrow: 1 }}>
        <TabPanel
          selectedIndex={tabIndex}
          onOptionChanged={onSelectionTabChanged}
          focusStateEnabled={false}
          className="ds-tab-panel"
          height="100%"
        >
          <TabItem title="Carreras">
            <CareersSection
              tabIndex={tabIndex}
              data={careers}
              institutions={institutions}
              onDataChanged={careersRefresh}
            />
          </TabItem>
          <TabItem title="Pensums">
            <PensumsSection
              tabIndex={tabIndex}
              data={pensums}
              careers={careers}
              institutions={institutions}
              onDataChanged={pensumsRefresh}
            />
          </TabItem>

        </TabPanel>
      </div>
    </div>
  );
}
export default Careers;