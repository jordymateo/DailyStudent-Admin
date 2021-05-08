import { Autocomplete, Button, DataGrid, NumberBox, ResponsiveBox, TextBox, ValidationGroup, Validator } from 'devextreme-react';
import { Column, Grouping, GroupPanel, Paging, Scrolling, SearchPanel } from 'devextreme-react/data-grid';
import { Col, Item, Row, Location } from 'devextreme-react/responsive-box';
import { RequiredRule } from 'devextreme-react/validator';
import notify from 'devextreme/ui/notify';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { ConfirmationPopup } from '../../components/ConfirmationPopup';
import { Pensum as PensumModel, Subject } from '../../models';
import { PensumsService } from '../../services';
import { IGridSubjectsProps } from './types';

// TODO: puede que se requiera agregar el limite de creditos de los periodos

// const GridSection: React.FC<IGridSubjectsProps> = ({ subjects, onAddMode }) => {

//   return (
//     <>

//     </>
//   );
// }

const Pensum: React.FC = () => {
  const match = useRouteMatch();
  const { id }: any = match.params;
  const history = useHistory();

  const validationGroupEl = useRef<ValidationGroup>(null);
  const [pensum, setPensum] = useState<PensumModel>();
  const [subjects, setSubjects] = useState<Subject[]>();
  const [periods, setPeriods] = useState<string[]>();

  const [itemSelected, setItemSelected] = useState<Partial<Subject>>({});
  const [isDisabledMode, setIsDisabledMode] = useState<boolean>(true);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [model, setModel] = useState<Partial<Subject>>({});

  const [openApproveConfirm, setOpenApproveConfirm] = useState<boolean>(false);

  const loadSubjects = () => {
    PensumsService
      .getSubjects(id)
      .then(data => {
        setSubjects(data);

        let periodsArr: any[] = [];
        for (let item in data) {
          if (periodsArr.indexOf(data[item].period) === -1)
            periodsArr.push(data[item].period);
        }

        setPeriods(periodsArr);

      });
  };

  useEffect(() => {
    PensumsService.get(id).then(data => setPensum(data));
    loadSubjects();
  }, []);

  const onSave = () => {
    const instance = validationGroupEl.current!.instance;

    if (instance.validate().isValid) {
      if (isEditMode) {
        PensumsService
          .updateSubject({ ...model, pensumid: parseInt(id) } as Subject)
          .then((data) => {
            loadSubjects();
            notify({ message: 'Materia actualizada correctamente!', width: 'auto' }, "success", 4500);
            setModel({ credits: 0 });
            instance.reset();
            setIsDisabledMode(true);
            setIsEditMode(false);
          }).catch((response: any) => {
            notify({ message: response.data.errors, width: 'auto' }, "error", 4500);
          });
      } else {
        PensumsService
          .createSubject({ ...model, pensumid: parseInt(id) } as Subject)
          .then((data) => {
            loadSubjects();
            notify({ message: 'Materia creada correctamente!', width: 'auto' }, "success", 4500);
            setModel({ credits: 0 });
            instance.reset();
            setIsDisabledMode(true);
          }).catch((response: any) => {
            notify({ message: response.data.errors, width: 'auto' }, "error", 4500);
          });
      }
    }
  };

  const onSaveOther = () => {
    const instance = validationGroupEl.current!.instance;

    if (instance.validate().isValid) {
      if (isEditMode) {
        PensumsService
          .updateSubject({ ...model, pensumid: parseInt(id) } as Subject)
          .then((data) => {
            loadSubjects();
            notify({ message: 'Materia actualizada correctamente!', width: 'auto' }, "success", 4500);
            setModel({ period: model.period, credits: 0 });
            setIsEditMode(false);
          }).catch((response: any) => {
            notify({ message: response.data.errors, width: 'auto' }, "error", 4500);
          });
      } else {
        PensumsService
          .createSubject({ ...model, pensumid: parseInt(id) } as Subject)
          .then((data) => {
            loadSubjects();
            notify({ message: 'Materia creada correctamente!', width: 'auto' }, "success", 4500);
            setModel({ period: model.period, credits: 0 });
          }).catch((response: any) => {
            notify({ message: response.data.errors, width: 'auto' }, "error", 4500);
          });
      }
    }
  };

  const onApproveDelete = () => {
    setOpenApproveConfirm(false);
    setItemSelected({});
    PensumsService
      .deleteSubject(itemSelected.id!)
      .then((data) => {
        loadSubjects();
        notify({ message: 'Materia eliminada correctamente!', width: 'auto' }, "success", 4500);
      }).catch((response: any) => {
        notify({ message: response.data.errors, width: 'auto' }, "error", 4500);
      });
  }

  return (
    <div className="pensum-management">
      <h2>
        <Button
          icon={'arrowleft'}
          height="40px"
          stylingMode={'text'}
          onClick={() => history.push('/careers')}
        />
      Gestionar pensum:
      <small>{pensum?.name}</small>
      </h2>
      <div className="pensum-info">
        <h4>{pensum?.institutionName}</h4>
        <h4>{pensum?.careerName}</h4>
      </div>

      <ValidationGroup ref={validationGroupEl}>
        <ResponsiveBox
          singleColumnScreen="sm"
        //screenByWidth={screen}
        >
          <Row ratio={1}></Row>
          <Row ratio={1}></Row>

          <Col ratio={1}></Col>
          <Col ratio={1}></Col>
          <Col ratio={1}></Col>

          <Item>
            <Location row={0} col={0} colspan={2} />
            <div style={{ width: '100%', maxWidth: 'fit-content', padding: '15px' }}>
              <DataGrid
                dataSource={subjects}
                allowColumnReordering={true}
                showBorders={true}
                width="100%"
                height="350px"
                selection={{ mode: 'single' }}
                keyExpr="id"
                selectedRowKeys={itemSelected ? [itemSelected.id] : undefined}
                onSelectionChanged={({ selectedRowsData }) => {
                  if (selectedRowsData)
                    setItemSelected(selectedRowsData[0])
                }}
              >
                <GroupPanel visible={true} allowColumnDragging={false} />
                <Grouping autoExpandAll={true} />
                <Scrolling mode="infinite" />

                <Column dataField="code" caption="Código" dataType="string" />
                <Column dataField="name" caption="Nombre" dataType="string" width="40%" />
                <Column dataField="credits" caption="Creditos" dataType="string" />
                <Column dataField="prerequisite" caption="Pre-requisitos" dataType="string" />
                <Column dataField="corequisite" caption="Co-requisitos" dataType="string" />
                <Column dataField="period" caption="Periodo" dataType="string" groupIndex={0} />
              </DataGrid>
              <div style={{ paddingTop: '5px', textAlign: 'right' }}>
                {(isDisabledMode) ? (
                  <>
                    <Button
                      icon={'plus'}
                      height="40px"
                      stylingMode={'text'}
                      hint="Agregar nuevo"
                      onClick={() => {
                        setIsDisabledMode(false);
                        setItemSelected({});
                      }}
                    />
                    <Button
                      icon={'edit'}
                      height="40px"
                      stylingMode={'text'}
                      disabled={!itemSelected}
                      hint="Editar"
                      onClick={() => {
                        setModel(itemSelected);
                        setItemSelected({});
                        setIsDisabledMode(false);
                        setIsEditMode(true);
                      }}
                    />
                    <Button
                      icon={'trash'}
                      height="40px"
                      stylingMode={'text'}
                      hint="Eliminar"
                      disabled={!itemSelected}
                      onClick={() => setOpenApproveConfirm(true)}
                    />
                  </>
                ) : (
                  <>
                    <Button
                      icon={'save'}
                      text={'Registrar otro'}
                      height="40px"
                      hint="Continuar registrando materias"
                      stylingMode={'text'}
                      onClick={onSaveOther}
                    />
                    <Button
                      icon={'save'}
                      height="40px"
                      stylingMode={'text'}
                      hint="Guardar"
                      onClick={onSave}
                    />
                    <Button
                      icon={'arrowleft'}
                      height="40px"
                      stylingMode={'text'}
                      hint="Cancelar"
                      onClick={() => {
                        setIsDisabledMode(true);
                        setItemSelected({});
                        setIsEditMode(false);
                        validationGroupEl.current!.instance.reset();
                        setModel({ credits: 0 });
                      }}
                    />
                  </>
                )}
              </div>
            </div>
          </Item>
          <Item>
            <Location row={0} col={2} rowspan={2} />
            <div style={{ padding: '15px 2px', height: '100%' }}>
              <embed src={pensum?.path} style={{ width: "-webkit-fill-available", }} height="100%" type="application/pdf" />
            </div>
          </Item>
          <Item>
            <Location row={1} col={0} />
            <div style={{ width: '100%', padding: '5px 15px' }}>
              <div className="form-input">
                <label>Periodo</label>
                <Autocomplete
                  items={periods}
                  rtlEnabled={false}
                  showClearButton
                  disabled={isDisabledMode}
                  value={model?.period}
                  onValueChange={(value) => setModel(prev => ({ ...prev, period: value }))}
                >
                  <Validator>
                    <RequiredRule message={'El periodo es requerido'} />
                  </Validator>
                </Autocomplete>
              </div>
              <div className="form-input">
                <label>Código</label>
                <TextBox
                  value={model?.code}
                  onValueChange={(value) => setModel(prev => ({ ...prev, code: value }))}
                  disabled={isDisabledMode}
                >
                  <Validator>
                    <RequiredRule message={'El código es requerido'} />
                  </Validator>
                </TextBox>
              </div>
              <div className="form-input">
                <label>Nombre</label>
                <TextBox
                  value={model?.name}
                  onValueChange={(value) => setModel(prev => ({ ...prev, name: value }))}
                  disabled={isDisabledMode}
                >
                  <Validator>
                    <RequiredRule message={'El nombre es requerido'} />
                  </Validator>
                </TextBox>
              </div>
            </div>
          </Item>
          <Item>
            <Location row={1} col={1} />
            <div style={{ width: '100%', padding: '5px 15px' }}>
              <div className="form-input">
                <label>Creditos</label>
                <NumberBox
                  value={model?.credits}
                  onValueChange={(value) => setModel(prev => ({ ...prev, credits: value }))}
                  min={0}
                  disabled={isDisabledMode}
                >
                  <Validator>
                    <RequiredRule message={'Los creditos son requeridos'} />
                  </Validator>
                </NumberBox>
              </div>
              <div className="form-input">
                <label>Pre-requisitos</label>
                <TextBox
                  value={model?.prerequisite}
                  onValueChange={(value) => setModel(prev => ({ ...prev, prerequisite: value }))}
                  disabled={isDisabledMode}
                />
              </div>
              <div className="form-input">
                <label>Co-requisitos</label>
                <TextBox
                  value={model?.corequisite}
                  onValueChange={(value) => setModel(prev => ({ ...prev, corequisite: value }))}
                  disabled={isDisabledMode}
                />
              </div>

            </div>
          </Item>
        </ResponsiveBox>

      </ValidationGroup>
      <ConfirmationPopup
        okText="Si"
        cancelText="No"
        message={`La materia seleccionada será eliminada. ¿Desea continuar?`}
        open={openApproveConfirm}
        onOk={onApproveDelete}
        onCancel={() => setOpenApproveConfirm(false)}
      />
    </div >
  );
}

export default Pensum;