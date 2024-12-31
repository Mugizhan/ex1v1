import React, { useState, useEffect } from "react";
import "./StatementsAssessment.css";
import { AssessmentLayout } from "../../../AssessmentLayout";
import { Box, CssBaseline, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import ActionElements from "./Utils/ActionElements";
import AssessmentHeader from "./Utils/AssessmentHeader";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import StatementsDragDrop from "./Utils/StatementsDragDrop";
import ParkingSpace from "./Utils/ParkingSpace";
import AssessmentApi from "../../../utils/services/pages/Assessment.api.js";
import {
  ASSESSMENT_ALLOWED_STATEMENTS_BY_SECTION,
  ASSESSMENT_STATUS_INPROGRESS,
} from "../../config.js";
import { useLocation, useNavigate } from "react-router-dom";
import AlertMessage from "../../AlertMessage";
import Loader from "../../Loader/Loader.jsx";
import useFullscreenExitNavigation from "./Utils/useFullScreenExitNavigation.js";
import "../../../css/SideMenu.css";

const StatementsAssessment = () => {
  const {
    fetchAssessmentDetailsBySection,
    getStepperDetails,
    saveSectionStatements,
    getUserAssessmentDetails,
    checkAssessmentStatus,
    putStartTimer,
  } = AssessmentApi;
  useFullscreenExitNavigation();
  const [actionElements, setActionElements] = useState([]);
  const [parkedElements, setParkedElements] = useState([]);
  const [orderedStatements, setOrderedStatements] = useState([]);
  const defaultStatement = {
    dimension: null,
    virtue: null,
    statement: "Drop Action Here",
  };
  const [currentSection, setCurrentSection] = useState("");
  const [currentSubSection, setCurrentSubSection] = useState("");
  const [sectionHeading, setSectionHeading] = useState();
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [timeLeft, setTimeLeft] = useState();
  const [stepper, setStepper] = useState([]);
  const [attemptCount, setAttemptCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const theme = createTheme({
    typography: {
      fontFamily: '"Inter", sans-serif',
    },
  });
  const location = useLocation();
  const navigate = useNavigate();

  const { typeId, assessmentId, InsOrgId } = location.state || {};
  const isTimeOut = 1;

  const handleBack = () => {
    navigate("/Assessment/Dashboard");
  };

  const handleCloseFullScreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch((err) => {
        console.error("Error exiting fullscreen:", err);
      });
    }
    navigate("/Assessment/Dashboard");
  };

  useEffect(() => {
    loadAssessmentSectionDetails();
  }, [currentSection, currentSubSection]);

  useEffect(() => {
    setCurrentSectionFromStepper();
  }, [stepper]);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadAllSections();
    const handleWindowBlur = () => {
      handleCloseFullScreen();
    };

    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "r") {
        handleCloseFullScreen();
      }
      if (event.key === "F5") {
        handleCloseFullScreen();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    window.addEventListener("blur", handleWindowBlur);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);

      window.removeEventListener("blur", handleWindowBlur);
    };
  }, []);

  // useEffect(() => {
  //   window.scrollTo(0, 0);
  //   loadAllSections();
  //   const exitHandler = () => {
  //     handleBack();
  //   };
  //   const handleWindowBlur = () => {
  //     handleBack();
  //     if (document.exitFullscreen) {
  //       document.exitFullscreen();
  //     } else if (document.webkitExitFullscreen) {
  //       document.webkitExitFullscreen();
  //     } else if (document.mozCancelFullScreen) {
  //       document.mozCancelFullScreen();
  //     } else if (document.msExitFullscreen) {
  //       document.msExitFullscreen();
  //     }
  //   };
  //   document.addEventListener("fullscreenchange", exitHandler);
  //   document.addEventListener("webkitfullscreenchange", exitHandler);
  //   document.addEventListener("mozfullscreenchange", exitHandler);
  //   document.addEventListener("MSFullscreenChange", exitHandler);
  //   window.addEventListener("blur", handleWindowBlur);

  //   return () => {
  //     document.removeEventListener("fullscreenchange", exitHandler);
  //     document.removeEventListener("webkitfullscreenchange", exitHandler);
  //     document.removeEventListener("mozfullscreenchange", exitHandler);
  //     document.removeEventListener("MSFullscreenChange", exitHandler);
  //     window.removeEventListener("blur", handleWindowBlur);
  //   };
  // }, []);

  const handleAlertClick = (severity, message) => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setOpenAlert(true);
  };

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenAlert(false);
  };

  const loadAssessmentSectionDetails = async () => {
    if (currentSection && currentSubSection) {
      let fetchedData = await fetchAssessmentDetailsBySection(
        currentSection,
        currentSubSection,
        typeId,
        assessmentId
      );
      if (
        fetchedData.status === "success" &&
        fetchedData.data.statementData?.length > 0 &&
        fetchedData.data.blockNames?.length > 0 &&
        fetchedData.data.sectionHeaders !== ""
      ) {
        setActionElements(fetchedData.data.statementData);
        loadOrderedStatements(fetchedData.data.blockNames);
        setSectionHeading(fetchedData.data.sectionHeaders);
      } else {
        handleAlertClick("error", "Error while loading assessment");
      }
    }
    setLoading(false);
  };

  const loadOrderedStatements = (blocks) => {
    let defaultStatementsFilled = Array(
      ASSESSMENT_ALLOWED_STATEMENTS_BY_SECTION
    ).fill(defaultStatement);
    let os = blocks.map((value) => {
      return {
        data: defaultStatementsFilled,
        heading: value,
      };
    });
    setOrderedStatements(os);
  };

  const loadAllSections = async () => {
    setLoading(true);
    if (assessmentId) {
      const assessmentResponse = await getUserAssessmentDetails(
        assessmentId,
        typeId
      );
      if (assessmentResponse.status === "success") {
        if (
          assessmentResponse?.data?.assessmentStatus ===
            ASSESSMENT_STATUS_INPROGRESS &&
          assessmentResponse?.data?.timer > 0
        ) {
          setTimeLeft(assessmentResponse?.data?.timer);
          setAttemptCount(assessmentResponse?.data?.attemptCount);
          const response = await getStepperDetails(typeId, assessmentId);
          if (response.status === "success") {
            let stepData = response.data.stepperDetails;
            const lastObject = stepData[stepData?.length - 1];
            if (
              lastObject?.section === assessmentResponse?.data?.section &&
              lastObject.subSection === assessmentResponse?.data?.subSection
            ) {
              gotoDashboard();
            } else {
              setStepper(response.data.stepperDetails);
            }
          } else {
            setStepper([]);
          }
        } else {
          gotoDashboard();
        }
      }
    } else {
      gotoDashboard();
    }
  };

  const gotoDashboard = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch((err) => {
        console.error("Error exiting fullscreen:", err);
      });
    }

    handleAlertClick(
      "error",
      "Invalid session please proceed from dashboard..."
    );
    setTimeout(() => {
      navigate("/Assessment/Dashboard");
    }, 3000);
  };

  const setCurrentSectionFromStepper = () => {
    if (stepper?.length > 0) {
      let current = stepper.find((item) => item["timer"] === null);
      if (current) {
        if (current.section === "P4") {
          navigate("/Assessment/NLPAssessment", {
            state: {
              categoryId: typeId,
              assessmentId: assessmentId,
              section: "P4",
              subSection: "A",
            },
          });
        }
        setCurrentSection(current.section);
        setCurrentSubSection(current.subSection);
      }
    }
  };

  const callSectionP4 = async () => {
    const startTimerResponse = await putStartTimer(assessmentId, typeId);
    if (startTimerResponse.status === "success") {
      navigate("/Assessment/NLPAssessment", {
        state: {
          categoryId: typeId,
          assessmentId: assessmentId,
          section: "P4",
          subSection: "A",
        },
      });
    } else {
      console.error("Start Timer failed");
      handleCloseFullScreen();
    }
  };
  const isOrderedStatementsValidForNext = () => {
    return actionElements?.length === 0 && parkedElements?.length === 0
      ? true
      : false;
  };

  const onClickNext = async () => {
    if (isOrderedStatementsValidForNext()) {
      setLoading(true);
      let fetchedData = await saveSectionStatements(
        assessmentId,
        typeId,
        currentSection,
        currentSubSection,
        orderedStatements
      );
      if (fetchedData.status === "success") {
        let lastObject;
        if (stepper[stepper?.length - 1].section === "P4") {
          lastObject = stepper[stepper?.length - 2];
        } else if (stepper[stepper?.length - 1].section === "P5") {
          lastObject = stepper[stepper?.length - 3];
        } else {
          lastObject = stepper[stepper?.length - 1];
        }
        if (
          lastObject?.section === currentSection &&
          lastObject.subSection === currentSubSection
        ) {
          callSectionP4();
        } else {
          let stepperData = fetchedData.data;
          setStepper(stepperData);
        }
      } else {
        handleAlertClick("error", "Error while loading assessment");
      }
    } else {
      handleAlertClick(
        "error",
        "Order all Statements before moving to next section"
      );
    }
  };

  const ExitAssessment = async () => {
    let response = await checkAssessmentStatus(
      assessmentId,
      typeId,
      null,
      isTimeOut
    );
    if (response.status === "success") {
      handleCloseFullScreen();
    }
  };

  const Exit = () => {
    ExitAssessment();
  };

  /* Drag events Start*/
  const onDragStart = (evt, source) => {
    let element = evt.currentTarget;
    element.classList.add("dragged");
    evt.dataTransfer.setData(
      "application/json",
      JSON.stringify({ id: evt.currentTarget.id, source: source })
    );
    evt.dataTransfer.effectAllowed = "move";
  };
  const onDragEnd = (evt) => {
    evt.currentTarget.classList.remove("dragged");
  };
  const onDragEnter = (evt) => {
    evt.preventDefault();
    let element = evt.currentTarget;
    element.classList.add("dragged-over");
    evt.dataTransfer.dropEffect = "move";
  };
  const onDragLeave = (evt) => {
    let currentTarget = evt.currentTarget;
    let newTarget = evt.relatedTarget;
    if (
      newTarget != null &&
      (newTarget.parentNode === currentTarget || newTarget === currentTarget)
    )
      return;
    evt.preventDefault();
    let element = evt.currentTarget;
    element.classList.remove("dragged-over");
  };
  const onDragOver = (evt) => {
    evt.preventDefault();
    evt.dataTransfer.dropEffect = "move";
  };
  const onDrop = (evt, type, index) => {
    evt.preventDefault();
    evt.currentTarget.classList.remove("dragged-over");
    const jsonString = evt.dataTransfer.getData("application/json");
    let data = JSON.parse(jsonString);
    moveDraggedItemOnDrop(data, type, index);
  };
  /* Drag events End*/

  const getItemToMoveAndRefillOrderStatements = (data) => {
    let optionArray = orderedStatements.find((o) => {
      if (o.heading === data.source) return o;
    });
    let moveItem = optionArray.data.find((s) => {
      if (s?.statement === data.id) {
        return s;
      }
    });
    //Replace Default Statement in Ordered Statements
    setOrderedStatements((orderedStatements) =>
      orderedStatements.map((os) => {
        if (os.heading === data.source) {
          return {
            ...os,
            data: os.data.map((d) =>
              d.statement === data.id ? { ...d, ...defaultStatement } : d
            ),
          };
        }
        return os;
      })
    );
    return moveItem;
  };

  const addBacktoActionElementsIfItemExists = (type, index) => {
    let optionArray = orderedStatements.find((o) => {
      if (o.heading === type) return o;
    });
    let addBackToAEItem = optionArray.data.find((s, idx) => {
      if (parseInt(idx) === parseInt(index)) {
        return s;
      }
    });
    if (addBackToAEItem.statement !== defaultStatement.statement) {
      setParkedElements((parkedElements) => [
        ...parkedElements,
        addBackToAEItem,
      ]);
    }
  };

  const moveDraggedItemOnDrop = (data, type, index) => {
    let moveItem = null;
    if (type === "ActionElements") {
      if (data.source === "ActionElements" || data.source === "ParkingSpace") {
        // Do nothing
      } else {
        moveItem = getItemToMoveAndRefillOrderStatements(data);
        if (moveItem)
          setActionElements((actionElements) => [...actionElements, moveItem]);
      }
    } else if (type !== "ParkingSpace") {
      //find Item to move and remove from Source - Start
      if (data.source === "ActionElements") {
        addBacktoActionElementsIfItemExists(type, index);
        moveItem = actionElements.find((ae) => ae.statement === data.id);
        if (moveItem)
          setActionElements((actionElements) =>
            actionElements.filter((item) => item !== moveItem)
          );
      } else if (data.source === "ParkingSpace") {
        addBacktoActionElementsIfItemExists(type, index);
        moveItem = parkedElements.find((pe) => pe.statement === data.id);
        if (moveItem)
          setParkedElements((parkedElements) =>
            parkedElements.filter((item) => item !== moveItem)
          );
      } else {
        addBacktoActionElementsIfItemExists(type, index);
        moveItem = getItemToMoveAndRefillOrderStatements(data);
      }
      //find Item to move and remove from Source - End
      // Insert found item in Specific location of ordered Statements
      if (moveItem) {
        setOrderedStatements((orderedStatements) =>
          orderedStatements.map((item) =>
            item.heading === type
              ? {
                  ...item,
                  data: item.data.map((el, idx) =>
                    idx === index ? moveItem : el
                  ),
                }
              : item
          )
        );
      }
    }
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Grid container sx={{ background: "#FFFFFF" }}>
          <>
            <Grid size={9}>
              <Box>
                <AssessmentLayout></AssessmentLayout>
                <Box sx={{ margin: "0px 30px" }}>
                  <AssessmentHeader
                    sectionHeading={sectionHeading}
                    stepperDetails={stepper}
                    timeLeft={timeLeft}
                    sectionLimit="P3"
                    Exit={Exit}
                    attemptCount={attemptCount}
                  />
                  {loading ? (
                    <Loader />
                  ) : (
                    <>
                      <StatementsDragDrop
                        orderedStatements={orderedStatements}
                        onDragStart={onDragStart}
                        onDragEnd={onDragEnd}
                        onDragLeave={onDragLeave}
                        onDragEnter={onDragEnter}
                        onDragOver={onDragOver}
                        onDrop={onDrop}
                      />
                      <Box>
                        <Button
                          className="assessment-next-btn"
                          onClick={onClickNext}
                        >
                          Next {">>"}{" "}
                        </Button>
                      </Box>
                    </>
                  )}
                </Box>
              </Box>
            </Grid>
            {!loading && (
              <Grid size={3}>
                <Box
                  className="custom-scrollbar"
                  sx={{
                    height: "100vh",
                    backgroundColor: "#507FA9",
                    overflowY: "auto",
                    overflowX: "hidden",
                  }}
                >
                  <ActionElements
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    onDragLeave={onDragLeave}
                    onDragEnter={onDragEnter}
                    onDragOver={onDragOver}
                    onDrop={onDrop}
                    actionElements={actionElements}
                  />
                  <ParkingSpace
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    onDragLeave={onDragLeave}
                    onDragEnter={onDragEnter}
                    onDragOver={onDragOver}
                    onDrop={onDrop}
                    parkedElements={parkedElements}
                  />
                </Box>
              </Grid>
            )}
          </>
        </Grid>
        <AlertMessage
          open={openAlert}
          handleClose={handleAlertClose}
          message={alertMessage}
          severity={alertSeverity}
        />
      </ThemeProvider>
    </>
  );
};

export default StatementsAssessment;
