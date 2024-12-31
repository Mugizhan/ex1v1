import React, { useState,useRef, useContext } from 'react'
import axios from 'axios'
import { authContext } from '../App'
import {useNavigate} from 'react-router-dom'
import Loginimg from './images/image.png'
import Logo from './images/logo.png'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid'
import Paper  from '@mui/material/Paper'
import { FormControl, Typography,TextField, InputAdornment, Button, Input } from '@mui/material'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';


const Login = () => {
    const[pass,setPass]=useState(true)
    const emailRef=useRef()
    const passwordRef=useRef()
    const navigate=useNavigate()
    const {setToken}=useContext(authContext)
    const Handle=async(e)=>{
        e.preventDefault()
        const users={
            "userEmail": emailRef.current?.value,
            "password": passwordRef.current?.value,
            "typeId": 1
          }
          try{
            const responce=await axios.post('https://limenealdev.azurewebsites.net/api/login/login',users)
            navigate('/home')
            const {userName,accessToken}=responce.data
            setToken(accessToken)

          }
          catch(err){
            console.log(err )
          }

        
    }

  return (
    <Box sx={{display:'flex',height:'100vh'}} component={Paper} elevation={5}>
        <Grid container >
            <Grid item 
            xs={12}
            sm={12}
            md={6}
            
               sx={{
                display:'flex',
                flexDirection:'column',
                justifyContent:'center',
                alignItems:'center',
               
            }}>
                
                <Stack m={3} >
                    <Box>
                        <img src={Logo} alt="" />
                        <Typography variant='h5' sx={{fontWeight:'bold'}}>
                        Log in to your account
                        </Typography>
                        <Typography variant='p' color="textDisabled">
                        Welcome! Please Check your Email for Username and Password
                        </Typography>
                    </Box>
                    <Box sx={{marginTop:"5%"}}> 
                        <FormControl sx={{display:'flex'}}>
                           <TextField
                           size='small'
                           inputRef={emailRef}
                           label='Email'
                           margin='normal'
                           placeholder='Enter your Email'
                           slotProps={{
                            input:{
                                startAdornment:(
                                    <InputAdornment position='start'>
                                    <EmailOutlinedIcon />
                                    </InputAdornment>
                                )
                            }
                           }}/>

                           <TextField 
                           margin='normal'
                           size='small'
                           inputRef={passwordRef}
                           type={!pass?'text':'password'}
                           label='Password'
                        placeholder='Enter your password'
                           slotProps={{
                            input:{
                                startAdornment:(
                                    <InputAdornment sx={{mr:'1%'}}>
                                    <LockOutlinedIcon/>
                                    </InputAdornment>
                                ),
                                endAdornment:(
                                    <InputAdornment onClick={e=>setPass(!pass)} sx={{cursor:'auto'}}>
                                        {pass?<VisibilityOffOutlinedIcon/>:<VisibilityOutlinedIcon/>}
                                    </InputAdornment>
                                )
                            }
                           }}
                           />
                           <Button variant='contained' sx={{marginTop:'5%'}} onClick={Handle}>
                            Login
                           </Button>
                        </FormControl>
                    </Box>    
                </Stack>
                <Box sx={
                            {   
                                marginTop:'20%',
                            }
                        }>
                        <Typography variant='p' width={"100%"} color='textDisabled' fontSize={14}> 
                        www.sampleTechnology.com | Customer support +91 9384932109<br/>
                        Limited wilson@ all rights reserved
                        </Typography>
                    </Box>  

                </Grid>

                <Grid item
                flex={1}
                xs={6}
                sx={{
                    display:{xs:'none',sm:'none',md:'flex'}
                }}
                >
                <img src={Loginimg} alt="" style={{height:'100vh',objectFit:'cover'}} />
                </Grid>

                </Grid>

    </Box>
  )
}

export default Login