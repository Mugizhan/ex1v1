import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Logo from './images/logo.png';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid2';
import TextField from '@mui/material/TextField';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { DndContext, closestCenter, useSensors, useSensor, MouseSensor, TouchSensor, useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import Grid2 from '@mui/material/Grid2';
import { ListItemText } from '@mui/material';


const DraggableItem = ({ id, label }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useDraggable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Box ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ListItem
        style={{ cursor: 'grab'}}
        sx={{
          bgcolor: 'white',
          my:'2%',
          borderRadius:'5px',
          fontSize:'5px'
        }}
      >
        <ListItemIcon>
          <DragIndicatorIcon fontSize="medium" color={'primary'} sx={{ cursor: 'grab' ,opacity:'50%'}} />
        </ListItemIcon>
        <ListItemText secondary={label} sx={{
          fontSize:'2px'
        }} />
      </ListItem>
    </Box>
  );
};
const DroppableField = ({ id, value }) => {
  const { setNodeRef } = useDroppable({ id });
  const style = {
    borderRadius: "8px",
    
  };

  return (
    <Box ref={setNodeRef} style={style} display={'flex'} width={"100%"} p={"5px"} my={1}  sx={{border:'1px solid gray'}}>
    <Box px={2} sx={{fontSize:'20px',color:'white',bgcolor:'#2196f3',borderRadius:'10px'}} >
      {`#${id}`}
    </Box>
    <Box width={"100%"}>
      
    <TextField
  placeholder={`Drop Action Here ${id}`}
      value={value}
size='small'
variant="outlined"
fullWidth

InputProps={{
  style: { border: 'none' }, // Inline styling
  
}}
sx={{
  '.MuiOutlinedInput-notchedOutline': { border: 'none' }, // MUI-specific class override
}}
/>

    </Box>
  </Box>
  );
};


const Dragndrop = () => {
  const theme = useTheme(); 
   const [mostEnjoyFields, setMostEnjoyFields] = useState({
    1:'', 2: '',3:'',4:'',5:'',6:'' 
    });
    const [somewhatEnjoyFields, setSomewhatEnjoyFields] = useState({
      7:'', 8: '',9:'',10:'',11:'',12:'' 
    });
    const [leastEnjoyFields, setLeastEnjoyFields] = useState({
      13:'', 14: '',15:'',16:'',17:'',18:'' 
    });
    
   const [options, setOptions] = useState([
      { id: '1', label: 'achieve Goal' },
      { id: '2', label: 'assisting Others' },
      { id: '3', label: 'guiding Others' },
      { id: '4', label: 'researching' },
      { id: '5', label: 'smart planing' },
      { id: '6', label: 'hormonizing' },
      { id: '7', label: 'bonding' },
      { id: '8', label: 'energizing others' },
      { id: '9', label: 'challenging and winning' },
      { id: '10', label: 'caring' },
      { id: '11', label: 'advising' },
      { id: '12', label: 'logical reasoning' }
    ]);

    const sensors=useSensors(
      useSensor(MouseSensor),
      useSensor(TouchSensor,{
       activationConstraint:{
        delay:200,
        tolarance:5
       }
      })
    )

    const handleDropEnd = (event) => {
      const { active, over } = event;
      console.log("active :", active);
      if (over) {
        const activeOption = options.find((o) => o.id === active.id);
        console.log("activeOption :", activeOption);
        if (mostEnjoyFields[over.id] !== undefined) {
          const previousValue = mostEnjoyFields[over.id];
          setMostEnjoyFields((prev) => ({ ...prev, [over.id]: activeOption?.label }));
          setOptions((value) => {
            const newOptions = value.filter((o) => o.id !== active.id);
            if (previousValue) {
              newOptions.push({ id: active.id, label: previousValue });
            }
            return newOptions;
          });
        } else if (somewhatEnjoyFields[over.id] !== undefined) {
          const previousValue = somewhatEnjoyFields[over.id];
          setSomewhatEnjoyFields((prev) => ({ ...prev, [over.id]: activeOption?.label }));
          setOptions((value) => {
            const newOptions = value.filter((o) => o.id !== active.id);
            if (previousValue) {
              newOptions.push({ id: active.id, label: previousValue });
            }
            return newOptions;
          });
        } else if (leastEnjoyFields[over.id] !== undefined) {
          const previousValue = leastEnjoyFields[over.id];
          setLeastEnjoyFields((prev) => ({ ...prev, [over.id]: activeOption?.label }));
          setOptions((value) => {
            const newOptions = value.filter((o) => o.id !== active.id);
            if (previousValue) {
              newOptions.push({ id: active.id, label: previousValue });
            }
            return newOptions;
          });
        }
      }
    };


  

  return (
    <Box m={0} sx={{ display: 'flex', height: '100vh' }}>
        <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDropEnd}
      display={'flex'}
      flexDirection={'column'}
      >
        <Box flex={4} display={{md:'flex'}}  w={'100%'} >
      <Box w={'100%'}>
      <AppBar position="static" sx={{ backgroundColor: 'white', boxShadow: 'none', zIndex: 1}} >
        <Toolbar sx={{ backgroundColor: 'white', display: 'flex', justifyContent: 'space-between' }}>
          <Box display={'flex'} alignItems={'center'}>
            <img src={Logo} style={{ width: '15%' }} alt="" />
            <Typography color="primary" variant="h6" fontWeight={'bold'} sx={{ fontSize: { xs: '13px', md: '16px' } }}>
              GATEWAY OF A CHAMPION
            </Typography>
          </Box>
          <Box>
          <Typography color="gray" variant="h6" sx={{ fontSize: { xs: '10px', md: '15px' } }}>
              sample@gmail.com
            </Typography>
            
          </Box>
        </Toolbar>
        
      </AppBar>
      <Divider/>
      <Box
          component="main"
          display={'flex'}
          width={'100%'}
          height={{md:'100vh'}}
          diplay={'flex'}
          justifyContent={'center'}
        >
          <Box width={{sx:'100%',sm:'100%',md:'80%'}} >
          <Typography variant='h6' fontWeight={'bold'}>
            A. Tell us how much you enjoy
          </Typography><br/>
          <Box sx={{border:'1px solid black',borderTop:"5px solid #2196f3",borderRadius:'10px'}} width={'100%'}>
          <Grid2 container width={'95%'} spacing={2} mt={2} mx={1}  >

            {/* tab 1.1*/}
            <Grid item size={4} >
            <Typography variant='h6' color='black' fontSize={{md:"15px",sm:'12px',xs:'12px'}} >
            I enjoy most
          </Typography>

          {
            [1,2,3,4,5,6].map((index)=>(
              <Grid item size={6} key={index} width={'100%'}>
              <Box >
                <DroppableField id={index} value={mostEnjoyFields[index]} />
              </Box>
            </Grid>
            ))
          }

            </Grid>

            {/* tab 1.2*/}
            <Grid item size={4}>
            <Typography variant='h6' color='black' fontSize={{md:"15px",sm:'12px',xs:'12px'}} >
            I somewhat most
          </Typography>
          {
            [7,8,9,10,11,12].map((index)=>(
              <Grid item size={6} key={index} width={'100%'}>
              <Box >
                <DroppableField id={index} value={somewhatEnjoyFields[index]} />
              </Box>
            </Grid>
            ))
          }


            </Grid>

            {/* tab 1.2*/}
            <Grid item size={4}>
            <Typography variant='h6' color='black' fontSize={{md:"15px",sm:'12px',xs:'12px'}}>
            I least most
          </Typography>
          {
            [13,14,15,16,17,18].map((index)=>(
              <Grid item size={6} key={index} width={'100%'}>
              <Box >
                <DroppableField id={index} value={leastEnjoyFields[index]} />
              </Box>
            </Grid>
            ))
          }


            </Grid>

          </Grid2></Box>

          </Box>

        
        </Box>


      </Box>
      <Box flex={1} sx={{bgcolor:theme.palette.primary.main}} w={'100%'} >
      <Typography variant='h6' fontSize={"20px"} m={2} fontWeight={'bold'} sx={{color:'white'}}>
            Action Elements
          </Typography>
    

<Box flex={1} mx={2} display={'flex'} flexDirection={'column'}>
            <List>
              {options.map((item) => (
                <DraggableItem key={item.id} id={item.id} label={item.label} />
              ))}
            </List>
          </Box>


      </Box>
      </Box>
      </DndContext> 
    </Box>
  );
};

export default Dragndrop;