import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Logo from "./images/logo.png";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import Grid2 from "@mui/material/Grid2";
import TextField from "@mui/material/TextField";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import {
  DndContext,
  closestCenter,
  useSensors,
  useSensor,
  MouseSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { ListItemText } from "@mui/material";

const DraggableItem = ({ id, label }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useDraggable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <ListItem
        style={{ cursor: "grab", userSelect: "none" }}
        sx={{
          bgcolor: "white",
          my: "8px",
          borderRadius: "5px",
        }}
      >
        <ListItemIcon>
          <DragIndicatorIcon
            fontSize="medium"
            color="primary"
            sx={{ cursor: "grab", opacity: "50%" }}
          />
        </ListItemIcon>
        <ListItemText secondary={label} />
      </ListItem>
    </Box>
  );
};

const DroppableField = ({ id, value }) => {
  const { setNodeRef } = useDroppable({ id });
  return (
    <Box
      ref={setNodeRef}
      display="flex"
      width="100%"
      p="5px"
      my={1}
      sx={{ border: "1px solid gray", borderRadius: "8px" }}
    >
      <Box
        px={2}
        sx={{
          fontSize: "20px",
          color: "white",
          bgcolor: "#3f50b5",
          borderRadius: "10px",
        }}
      >
        {`${id}`}
      </Box>
      <Box width="100%" ml={2}>
        <TextField
          placeholder={`Drop Action Here ${id}`}
          value={value || ""}
          size="small"
          variant="outlined"
          fullWidth
          InputProps={{
            style: { border: "none" },
          }}
          sx={{
            ".MuiOutlinedInput-notchedOutline": { border: "none" },
          }}
        />
      </Box>
    </Box>
  );
};

const Dragndrop = () => {
  const theme = useTheme();

  // Separate states for each grid
  const [mostEnjoyFields, setMostEnjoyFields] = useState({
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
    6: "",
  });
  const [somewhatEnjoyFields, setSomewhatEnjoyFields] = useState({
    7: "",
    8: "",
    9: "",
    10: "",
    11: "",
    12: "",
  });
  const [leastEnjoyFields, setLeastEnjoyFields] = useState({
    13: "",
    14: "",
    15: "",
    16: "",
    17: "",
    18: "",
  });

  const [options, setOptions] = useState([
    { id: "1", label: "Achieve Goal" },
    { id: "2", label: "Assisting Others" },
    { id: "3", label: "Guiding Others" },
    { id: "4", label: "Researching" },
    { id: "5", label: "Smart Planning" },
    { id: "6", label: "Harmonizing" },
    { id: "7", label: "Bonding" },
    { id: "8", label: "Energizing Others" },
    { id: "9", label: "Challenging and Winning" },
    { id: "10", label: "Caring" },
    { id: "11", label: "Advising" },
    { id: "12", label: "Logical Reasoning" },
  ]);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    })
  );

  const handleDropEnd = (event) => {
    const { active, over } = event;
    if (over) {
      const activeOption = options.find((o) => o.id === active.id);

      // Update the appropriate grid state based on the droppable field
      if (mostEnjoyFields[over.id] !== undefined) {
        setMostEnjoyFields((prev) => ({
          ...prev,
          [over.id]: activeOption?.label,
        }));
      } else if (somewhatEnjoyFields[over.id] !== undefined) {
        setSomewhatEnjoyFields((prev) => ({
          ...prev,
          [over.id]: activeOption?.label,
        }));
      } else if (leastEnjoyFields[over.id] !== undefined) {
        setLeastEnjoyFields((prev) => ({
          ...prev,
          [over.id]: activeOption?.label,
        }));
      }

      // Update options list
      setOptions((value) => value.filter((o) => o.id !== active.id));
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDropEnd}
      >
        {/* Left Panel */}
        <Box flex={3} sx={{ display: "flex", flexDirection: "column" }}>
          <AppBar position="static" sx={{ backgroundColor: "white" }}>
            <Toolbar sx={{ justifyContent: "space-between" }}>
              <Box display="flex" alignItems="center">
                <img src={Logo} alt="Logo" style={{ width: "15%" }} />
                <Typography
                  color="primary"
                  variant="h6"
                  sx={{ ml: 2, fontSize: "15px" }}
                >
                  GATEWAY OF A CHAMPION
                </Typography>
              </Box>
              <Typography color="primary" variant="h6" fontSize="12px">
                sample@gmail.com
              </Typography>
            </Toolbar>
          </AppBar>
          <Divider />
          <Box
            component="main"
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
            mt={2}
          >
            <Box width="80%">
              <Typography variant="h6" fontWeight="bold" mb={2}>
                A. Tell us how much you enjoy
              </Typography>
              <Box
                sx={{
                  border: "1px solid black",
                  borderTop: "5px solid #3f50b5",
                  borderRadius: "10px",
                  padding: "20px",
                }}
              >
                <Grid2 container spacing={3}>
                  <Grid2 xs={4}>
                    <Typography variant="h6" color="primary">
                      I enjoy most
                    </Typography>
                    {Object.keys(mostEnjoyFields).map((id) => (
                      <DroppableField
                        key={id}
                        id={id}
                        value={mostEnjoyFields[id]}
                      />
                    ))}
                  </Grid2>
                  <Grid2 xs={4}>
                    <Typography variant="h6" color="primary">
                      I somewhat enjoy
                    </Typography>
                    {Object.keys(somewhatEnjoyFields).map((id) => (
                      <DroppableField
                        key={id}
                        id={id}
                        value={somewhatEnjoyFields[id]}
                      />
                    ))}
                  </Grid2>
                  <Grid2 xs={4}>
                    <Typography variant="h6" color="primary">
                      I least enjoy
                    </Typography>
                    {Object.keys(leastEnjoyFields).map((id) => (
                      <DroppableField
                        key={id}
                        id={id}
                        value={leastEnjoyFields[id]}
                      />
                    ))}
                  </Grid2>
                </Grid2>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Right Panel */}
        <Box flex={1} sx={{ bgcolor: theme.palette.primary.main, p: 2 }}>
          <List>
            {options.map((item) => (
              <DraggableItem key={item.id} id={item.id} label={item.label} />
            ))}
          </List>
        </Box>
      </DndContext>
    </Box>
  );
};

export default Dragndrop;