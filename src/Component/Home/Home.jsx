import React, { useContext, useEffect, useState } from 'react'
import { authContext } from '../../App'
import axios from 'axios'
import Box from '@mui/material/Box'
import Userimg from '../images/userimg.png'
import { AppBar, Button, IconButton, Toolbar, Tooltip, Typography, Grid, Stack, List, ListSubheader, ListItemIcon, ListItem, ListItemText, TextField, InputAdornment, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Container, Paper } from '@mui/material'
import Logo from '../images/logo.png'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { useNavigate } from 'react-router-dom'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

const Home = () => {
  const { token, setToken } = useContext(authContext)
      const [searchInput,setsearchInput]=useState("")
  console.log(token)
  const navigate = useNavigate() 
  const [userData, setData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
        try {
          const responce=axios.get('https://limenealdev.azurewebsites.net/api/job/generalcareerdetails?PageNumber=1&PageSize=100&Id=1',{
            method:"GET",
            credientials:"include",
            headers:{
              'Content-Type':'application/json',
              Authorization:`Bearer ${token}`
            }
          }).then(data=>{
            setData(data.data.careers)
          })
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    fetchData();
}, [token]);

  const logOut = () => {
    setToken(null)
    navigate('/')
  }

  const filterData=userData.filter(data=>{
    return(
      data.id.toLowerCase().includes(searchInput.toLowerCase())||data.description.toLowerCase().includes(searchInput.toLowerCase())
    )
  })


filterData.some(data=>{
  console.log(data)
})


  return (
    <Box>
      <AppBar>
        <Toolbar sx={{ backgroundColor: 'white', display: 'flex', justifyContent: 'space-between' }}>
          <Box display={'flex'} alignItems={'center'}>
            <img src={Logo} style={{
              width: '20%'
            }} alt="" />
            <Typography color='primary' variant='h6' sx={{ fontSize: { xs: '15px', md: '20px' } }}> Limeneal Wheel@</Typography>
          </Box>
          <Box>
            <Tooltip title="Logout"><Button endIcon={<LogoutRoundedIcon />} onClick={logOut} /></Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
      <Box sx={{ width: '100%', height: '100vh' }}>

        <Grid container display={'flex'} flexDirection={{ xs: 'column-reverse', md: 'row' }}>
          <Grid item
            flex={1}
            xs={12}
            sm={12}
            md={6}>
            <Stack m={2} display={'flex'}
              justifyContent={'center'}
              mt={{ md: '20%' }}>
              <Typography variant='h5' fontWeight={'bold'} fontSize={{ md: '35px' }}>Welcome thor <br />to the Limeaneal Wheel@</Typography>
              <br />
              <Typography variant='body1' textAlign={'justify'}>In case you are new to the Limeneal Wheele we encourage you to take a look at our <a href=''>know more</a> and get deeper insights into the model.

                Upon completing your journey, allow 48 to 72 hours for our scientifically proven model to process your report. You will be notified by an email as soon as your report is processed.</Typography>
              <br /> <Typography variant='h6' color='primary' fontSize={{ xs: '15px', sm: '15px', md: '20px' }} fontWeight={'bold'}>As you embark on the journey to express your preferences...</Typography>
              <br />
              <List
                subheader={
                  <ListSubheader><Typography variant='h5' fontWeight={'bold'} fontSize={{ xs: '20px', md: '30px' }}>Remember !</Typography></ListSubheader>
                }>
                <ListItem>
                  <ListItemIcon><CheckCircleRoundedIcon color='primary' /></ListItemIcon>
                  <ListItemText><Typography variant='body2' fontSize={'15px'} >You are unique</Typography></ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckCircleRoundedIcon color='primary' /></ListItemIcon>
                  <ListItemText><Typography variant='body2' fontSize={'15px'} >Only you know yourself best</Typography></ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckCircleRoundedIcon color='primary' /></ListItemIcon>
                  <ListItemText><Typography variant='body2' fontSize={'15px'} >There is no right or wrong answer</Typography></ListItemText>
                </ListItem>

              </List>
            </Stack>

          </Grid>
          <Grid item
            flex={1}
            xs={12}
            sm={12}
            md={6}>

            <Box width={{ xs: '70%', sm: '70%', md: '100%' }} height={{ xs: '50%', sm: '50%', md: '80%' }} mt={{ xs: '10%', md: '9%' }} mx={{ sm: '15%', xs: '15%', md: '0%' }} display="flex" justifyContent="center" alignItems="center">
              <img src={Userimg} style={{ width: '100%', height: '100%' }} alt="" />
            </Box>
          </Grid>
        </Grid>

      </Box>
      <Container maxWidth='lg'>

        <TextField
          id="search"
          label="search"
          size="small"
          placeholder="search"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlinedIcon />
              </InputAdornment>
            ),
          }}
          variant="outlined"
          onChange={e => setsearchInput(e.target.value)}
          sx={{ width: '400px', margin: {md:'2%'},  my:'5%' }}
        />
        <TableContainer component={Paper}>
          <Table size="small" >
            <TableHead>
              <TableRow sx={{ backgroundColor: '#cfd8dc', color: '#263238' }}>
                <TableCell>ID </TableCell>
                <TableCell>careerCluster</TableCell>
                <TableCell>career</TableCell>
                <TableCell>description</TableCell>
                <TableCell>industry1</TableCell>
                <TableCell>industry2</TableCell>
                <TableCell>function</TableCell>
                <TableCell>language </TableCell>
                <TableCell>updatedBy</TableCell>
                <TableCell>updatedOn</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
               { 
                        filterData==""?
                        userData && userData.map((row) => (
                          <TableRow key={row.id}>
                            <TableCell align="left">{row.id}</TableCell>
                            <TableCell align="left">{row.careerCluster}</TableCell>
                            <TableCell align="left">{row.career}</TableCell>
                            <TableCell align="left">{row.description}</TableCell>
                            <TableCell align="left">{row.industry1}</TableCell>
                            <TableCell align="left">{row.industry2}</TableCell>
                            <TableCell align="left">{row.function}</TableCell>
                            <TableCell align="left">{row.language}</TableCell>
                            <TableCell align="left">{row.updatedBy}</TableCell>
                            <TableCell align="left"><Button variant='contained'>{row.updatedOn}</Button></TableCell>
              
                          </TableRow>
                        )):
                        filterData && filterData.map((row) => (
                          <TableRow
                            key={row.id}
                          >
                            <TableCell component="th" scope="row">
                              {row.id}
                            </TableCell>
                            <TableCell align="left">{row.id}</TableCell>
                            <TableCell align="left">{row.careerCluster}</TableCell>
                            <TableCell align="left">{row.career}</TableCell>
                            <TableCell align="left">{row.description}</TableCell>
                            <TableCell align="left">{row.industry1}</TableCell>
                            <TableCell align="left">{row.industry2}</TableCell>
                            <TableCell align="left">{row.function}</TableCell>
                            <TableCell align="left">{row.language}</TableCell>
                            <TableCell align="left">{row.updatedBy}</TableCell>
                            <TableCell align="left"><Button variant='contained'>{row.updatedOn}</Button></TableCell>
              
                          </TableRow>
                        ))
                        
                        }
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant='body2' sx={{ color: '#b0bec5', margin: '5%', display: 'flex', alignItems: 'center' }}>  *  Email notification will be sent to the sponsor of the exercise directly, where we are instructed to share the details with them in such cases you may not be able to view or download the report</Typography>

      </Container>
      <Box sx={{ backgroundColor: '#2196f3', color: 'white' }} padding={10}>
        <Box sx={{ backgroundColor: '#2196f3', display: 'flex', justifyContent: 'center', color: 'white' }}>
          <Typography variant='body1'>Join 4,000+ companies already growing</Typography>
        </Box><br /><br />
        <Box sx={{ fontWeight: 'bold', display: 'flex', justifyContent: 'space-between'}}>
          <Typography variant='h5' fontSize={{sm:'10px',xs:'10px',md:'20px'}}>OdeaoLabs</Typography>
          <Typography variant='h5' fontSize={{sm:'10px',xs:'10px',md:'20px'}}>Kintsugi</Typography>
          <Typography variant='h5' fontSize={{sm:'10px',xs:'10px',md:'20px'}}>OdeaoLabs</Typography>
          <Typography variant='h5' fontSize={{sm:'10px',xs:'10px',md:'20px'}}>Kintsugi</Typography>
          <Typography variant='h5' fontSize={{sm:'10px',xs:'10px',md:'20px'}}>Wrapspped</Typography>
          <Typography variant='h5' fontSize={{sm:'10px',xs:'10px',md:'20px'}}>Sisyphus</Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default Home