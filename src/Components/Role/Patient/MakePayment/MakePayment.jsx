import React, { useState, useEffect } from 'react';
import patientAxiosInstance from '../../../../Axios/PatientAxios'
import { toast } from 'react-toastify';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { Link, useParams } from 'react-router-dom';
import CustomButton from '../../../Helpers/CustomButton';
import Slide from '@mui/material/Slide';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import LinearColor from '../../../Loader/CircleLoader';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { useNavigate } from 'react-router-dom';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function MakePayment({appointmentId}) {
  const defaultTheme = createTheme();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()
  const [appointmentData,setAppointmentData] = useState(null)

  
    const fetchData = () => {
      setLoading(true);

          patientAxiosInstance
            .post(`get_appoinment_details/${appointmentId}/`)
            .then((response) => {
              if (response.data.error) {
                toast.error(response.data.message);
                setLoading(false);

              } else {
                setAppointmentData(response.data.appointment_data)
               
                setLoading(false);

              }
            })
            .catch((error) => {
              console.log(error);
              toast.error(error.response.data.message);
              setLoading(false);

            }
            );
       
      };
    
      useEffect(() => {
        fetchData();
      }, [appointmentId]);
      const [selectedValue, setSelectedValue] = useState('stripe'); // Default value

  const handleRadioChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log('Selected value:', selectedValue);
  
    if (selectedValue === 'stripe') {
      navigate(`/patient/stripe_payment/${appointmentId}`);
      console.log(appointmentId,'appointmentData.id')
    } else {
      const payload = { appointmentId: appointmentId };
  
      try {
        const response = await patientAxiosInstance.post(`wallet_payment/${appointmentId}/`);

        // Handle the response here
        if (response.status === 200) {
          toast.success(response.data.message);
          navigate('/patient');
          handleOpen();

          console.log('Wallet payment successful:', response.data);
        } else {
          toast.error(response.data.message);

          console.error('Error:', response.statusText);
        }
      } catch (error) {
        toast.error(error.response.data.message);

        console.error('Error:', error);
      }
    }
  };
  
  return (
    <ThemeProvider theme={defaultTheme}>
  {loading ? ( // Conditionally render loader if loading is true
      <div style={{marginTop:'300px'}}>
        <LinearColor />
      </div>
      
    ) : (
    <Container maxWidth="lg"
    spacing={3}
     style={{ marginTop: '40px',
     display :'flex',
     flexDirection :'column',
     alignItems : 'center',
  }}
   >   
{appointmentData  ?(
     <Grid container spacing={2} style={{ justifyContent : 'center',marginTop:'30px'}}>
      <h2 style={{color:'#0d9eb5'}}>Make Payment</h2> 
         <img 
             src='https://res.cloudinary.com/da4bmqkkz/image/upload/v1696585540/ibook_pvx4cz.svg' />
         <Grid item xs={12} style={{marginTop:'-28px'}}>
          <Card  style={{ display: 'flex', flexDirection: 'row', alignItems: 'center',minHeight:'400px' }}>
             <CardContent>
              <div sx={{minHeight:'300px'}}>
               <div style={{ display: 'flex', alignItems: 'center' }}>
                 
               <img
                src="https://res.cloudinary.com/da4bmqkkz/image/upload/v1696575000/qq_t469fu.webp"
                alt="Doctor"
              />
               </div>
               </div>
             </CardContent>
             
             <CardContent>
             <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <div style={{paddingRight:'70px',paddingLeft:'70px'}}>
            <Typography sx={{padding:'10px'}}><strong>Doctor Name</strong></Typography>
              <Typography sx={{padding:'10px'}}><strong>Patient Name</strong></Typography>
              <Typography sx={{padding:'10px'}}><strong>Email</strong></Typography>
              <Typography sx={{padding:'10px'}}><strong>Mobile</strong></Typography>
              <Typography sx={{padding:'10px'}}><strong>Appointment Date</strong></Typography>
              <Typography sx={{padding:'10px'}}><strong>Appointment Time</strong></Typography>
              <Typography sx={{padding:'10px'}}><strong>Consultation Type</strong></Typography>
              <Typography sx={{padding:'10px'}}><strong>Consultation Fees</strong></Typography>

            </div>

              <div>
              <Typography sx={{padding:'10px'}}>Dr. {appointmentData.doctor}</Typography>
              <Typography sx={{padding:'10px'}}>{appointmentData.user}</Typography>
              <Typography sx={{padding:'10px'}}>{appointmentData.email}</Typography>
              <Typography sx={{padding:'10px'}}>{appointmentData.mobile}</Typography>
              <Typography sx={{ padding: '10px' }}>
                {new Date(appointmentData.selected_date).toLocaleDateString('en-GB')}
              </Typography>

              <Typography sx={{padding:'10px'}}>{appointmentData.time}</Typography>
              
              <Typography sx={{padding:'10px'}}>Video Call</Typography>
              {/* (<Typography sx={{padding:'10px'}}>Chat</Typography>)} */}
              <Typography sx={{padding:'10px',color:'green'}}><strong>
                ₹ {appointmentData.fees}</strong> </Typography>
              </div>
                </div>
                <div style={{marginLeft:'80px'}}>
                <FormLabel id="demo-radio-buttons-group-label">
                <h3 style={{color:'#0d9eb5'}}>Choose Payment Type</h3>
                </FormLabel>
                <form onSubmit={handleFormSubmit}>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue="stripe"
          name="radio-buttons-group"
          value={selectedValue}
          onChange={handleRadioChange}
        >
          <FormControlLabel value="wallet" control={<Radio />} label="Wallet Payment" />
          <FormControlLabel value="stripe" control={<Radio />} label="Stripe Payment" />
        </RadioGroup>

        <div style={{ marginLeft: '80px' }}>
          <CustomButton type="submit">Make Payment</CustomButton>
          {/* Use Link for navigation */}
          {/* <Link to={`/patient/stripe_payment/${appointmentData.id}`}>
            <CustomButton>Make Payment</CustomButton>
          </Link> */}
        </div>
      </form>
      </div>
             </CardContent>
           
           </Card>
        
         </Grid>
   
     </Grid>):(null)}
   </Container>
    )}
   </ThemeProvider>

  )
}

export default MakePayment
