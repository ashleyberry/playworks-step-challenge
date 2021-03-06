import React, { Component } from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../../redux/mapStoreToProps';
// import material ui
import { Button, TextField, Typography } from '@material-ui/core';
// import sweetalert
import swal from 'sweetalert';
// import s3 dropzone
import DropzoneS3Uploader from 'react-dropzone-s3-uploader';
// import css
import './CreateTeam.css';
// import logo
import Logo from '../../../images/PW-hor-logo.png';

class CreateTeam extends Component {
  state = {
    team_name: '',
    team_photo: '',
    company_name: '',
  }

  handleInputChangeFor = (propertyName) => (event) => {
    this.setState({
      [propertyName]: event.target.value,
    });
  };

  // Function runs on finish of file upload for s3 dropzone
  handleFinishedUpload = info => {
    this.setState({
      team_photo: info.fileUrl
    });
  };

  // Function is a confirmation function mainly for validation if everything is met and isCorrect then will run joinTeam function
  confirmationCreate = () => {
    if(this.state.team_name === ''){
      swal(`Please enter a team name`);
    }
    else if(this.state.company_name === ''){
      swal(`Please enter company name`);
    }
    else{
      swal({
        title: "Is the submitted info correct?",
        text: `Team Name: ${this.state.team_name} 
          Company Name: ${this.state.company_name}`,
        icon: "info",
        buttons: {
          cancel: "No",
          yes: true,
        }
      }).then(isCorrect => {
        if(isCorrect){
          this.createTeam();
          swal({
            title: "Your Team has been created!",
            icon: "success"
          }).then(() => {
            this.props.history.push('/home');
          })
        }
        else{
          swal("Please correct any info that is incorrect");
        }
      })
    };
  };

  // Function sends dispatch to saga and communicates with server for a POST / Create team.
  createTeam = () => {
    this.props.dispatch({
      type: 'CREATE_TEAM',
      payload: {
        team_name: this.state.team_name,
        team_photo: this.state.team_photo,
        company_name: this.state.company_name,
      }
    });
  }

  render() {
    const uploadOptions = {
      // signingUrlQueryParams: {uploadType: 'avatar'},
    }

    const s3Url = `http://${process.env.REACT_APP_S3_BUCKET}.s3.amazonaws.com`;

    return (
      <div>
        <div className='createPageLogoDiv'>
          <img className='createPageLogo' src= {Logo} alt=""/>
        </div>

        <div className='teamForm'>

          <center>
          <Typography variant='h5'>Create a Team</Typography>
            <div className='createTeamName'>
              <TextField 
                id="outlined-basic" 
                label="Team name" 
                variant="outlined"
                style={{width:300}} 
                onChange={this.handleInputChangeFor('team_name')}
              />
            </div>
            <div>
              <TextField 
                id="outlined-basic" 
                label="Company Name" 
                variant="outlined"
                style={{width:300}} 
                onChange={this.handleInputChangeFor('company_name')}
              />
            </div>
            <div className='dropzoneUploader'>
              <DropzoneS3Uploader
                onFinish={this.handleFinishedUpload}
                s3Url={s3Url}
                maxSize={1024 * 1024 * 5}
                upload={uploadOptions}
                className="previewImage"
              />
            </div>
            <Button variant='contained' 
              color='primary'
              style={{marginTop: '2rem'}} 
              onClick={this.confirmationCreate}>
                Submit
            </Button>
          </center>
        </div>

        <div className='createTeamfooter'>
          <button
            type="button"
            className="btn btn_asLink"
            onClick={() => {this.props.history.push('/createorjointeam')}}>
              Go Back
          </button>
          <button
            type="button"
            className="btn btn_asLink"
            onClick={() => {this.props.history.push('/jointeam')}}>
              Join Team
          </button>
          <button
            type="button"
            className="btn btn_asLink"
            onClick={() => this.props.dispatch({ type: 'LOGOUT' })}>
              Log Out
          </button>
        </div>
      </div>
    );
  }
}

export default connect(mapStoreToProps)(CreateTeam);