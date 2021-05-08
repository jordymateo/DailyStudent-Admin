
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import TabPanel, { Item as TabItem } from 'devextreme-react/tab-panel';
import { InstitutionsService } from "../../services";
import { Institution } from "../../models";
import { IInstitutionsSectionProps } from "./types";
import { Button, DataGrid } from "devextreme-react";
import { Column, FilterRow, HeaderFilter, Pager, Paging } from "devextreme-react/data-grid";
import { ConfirmationPopup } from "../../components/ConfirmationPopup";
import notify from "devextreme/ui/notify";
import Create from "./Create";

const InstitutionsSection: React.FC<IInstitutionsSectionProps> = ({ data, onDataChanged }) => {
  const [itemSelected, setItemSelected] = useState<Partial<Institution>>({});
  var [createVisible, setCreateVisible] = useState<boolean>(false);


  const [openStateConfirm, setOpenStateConfirm] = useState<boolean>(false);
  const [openApproveConfirm, setOpenApproveConfirm] = useState<boolean>(false);

  const onTonggleState = () => {
    setOpenStateConfirm(false);
    setItemSelected({});
    InstitutionsService.toggleState(itemSelected.id!)
      .then((data) => {
        onDataChanged();
        notify({ message: `Institución ${(itemSelected && !itemSelected.isDeleted) ? 'inactivado' : 'activado'} correctamente!`, width: 'auto' }, "success", 4500);
      }).catch((response: any) => {
        notify({ message: response.data.errors, width: 'auto' }, "error", 4500);
      });
  }

  const onApprove = () => {
    setOpenApproveConfirm(false);
    setItemSelected({});
    InstitutionsService.approve(itemSelected.id!)
      .then((data) => {
        onDataChanged();
        notify({ message: 'Institución aprobada correctamente!', width: 'auto' }, "success", 4500);
      }).catch((response: any) => {
        notify({ message: response.data.errors, width: 'auto' }, "error", 4500);
      });
  }

  const onStateChangeClick = () => {
    if (itemSelected) {
      if (itemSelected.isAvailable) {
        setOpenStateConfirm(true);
      } else {
        setOpenApproveConfirm(true);
      }
    }
  }

  return (
    <div className="tab-section-container">
      <div style={{ width: '95%', alignSelf: 'center', paddingTop: '10px', textAlign: 'right', marginBottom: '10px' }}>
        <Button
          text={'AGREGAR'}
          height="40px"
          stylingMode={'text'}
          onClick={() => {
            setCreateVisible(true);
            setItemSelected({});
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
          text={(itemSelected && !itemSelected.isAvailable) ? 'APROBAR' : (itemSelected && itemSelected.isDeleted) ? 'ACTIVAR' : 'INACTIVAR'}
          height="40px"
          stylingMode={'text'}
          type={(itemSelected && !itemSelected.isAvailable) ? 'success' : (itemSelected && itemSelected.isDeleted) ? 'success' : 'danger'}
          disabled={!itemSelected}
          onClick={onStateChangeClick}
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
            dataField="acronym"
            caption="Acrónimo"
            dataType="string"
          />
          <Column
            dataField="name"
            caption="Nombre"
            dataType="string"
          />
          <Column
            dataField="website"
            caption="Sitio web"
            dataType="string"
            cellComponent={({ data }) => {
              return (<a href={data.value} target="_blank">{data.value}</a>);
            }}
          />
          <Column
            dataField="creationDate"
            caption="Fecha de creación"
            dataType="date"
          />
          <Column
            dataField="logoPath"
            caption="Logo"
            dataType="string"
            cellComponent={({ data }) => {
              return (<a href={data.value} target="_blank">Link</a>);
            }}
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
        message={`La institución seleccionada se ${(itemSelected && !itemSelected.isDeleted) ? 'inactivará' : 'activará'}. ¿Desea continuar?`}
        open={openStateConfirm}
        onOk={onTonggleState}
        onCancel={() => setOpenStateConfirm(false)}
      />
      <ConfirmationPopup
        okText="Si"
        cancelText="No"
        message={`La institución seleccionada será aprobada. ¿Desea continuar?`}
        open={openApproveConfirm}
        onOk={onApprove}
        onCancel={() => setOpenApproveConfirm(false)}
      />
      <Create
        data={itemSelected ? {
          id: itemSelected.id!,
          acronym: itemSelected.acronym!,
          name: itemSelected.name!,
          website: itemSelected.website!,
          countryId: itemSelected.countryId!,
          logo: []
        } : undefined}
        visible={createVisible}
        onHidden={() => {
          setCreateVisible(false);
        }}
        onDataChanged={onDataChanged}
      />
    </div >
  );
}

const Institutions: React.FC = () => {

  var history = useHistory();
  var [tabIndex, setTabIndex] = useState<number>(0);
  var [institutions, setInstitutions] = useState<Institution[]>([]);

  const refreshInstitutions = () => {
    InstitutionsService.getAll().then(data => setInstitutions(data));
  };

  useEffect(() => {
    refreshInstitutions();
  }, []);


  var onSelectionTabChanged = (args: any) => {
    if (args.name == 'selectedIndex') {
      setTabIndex(args.value);
    }
  }

  return (
    <div className="course-section">
      <div className="course-section-header">
        <h1>Instituciones académicas</h1>
      </div>
      <div style={{ marginTop: '4em', flexGrow: 1 }}>
        <InstitutionsSection
          data={institutions}
          onDataChanged={refreshInstitutions}
        />
      </div>
    </div>
  );
}
export default Institutions;