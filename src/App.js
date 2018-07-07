import React, { Component } from 'react';

import firebase from 'firebase'

import FileUpload from './FileUpload'

import './App.css';

class App extends Component {

  constructor(){
    super()
    this.state = {
      user: null,
      pictures: [],
      uploadValue: 0
    }

    this.handleAuth = this.handleAuth.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
    this.handleUpload = this.handleUpload.bind(this)
    
  }

  componentWillMount(){
    firebase.auth().onAuthStateChanged(user=>{
      this.setState({
        user
      })
    })

    firebase.database().ref('pictures').on('child_added', snapshot=>{
      this.setState({
        pictures: this.state.pictures.concat(snapshot.val())
      })
    })
  }

  handleAuth(){
    const provider = new firebase.auth.GoogleAuthProvider()
    firebase.auth().signInWithPopup(provider)
      .then(result=>console.log(`${result.user.email} you have logged in!`))
      .catch(error=>console.log(`${error.code}: ${error.message}`))
  }

  handleLogout(){
    firebase.auth().signOut()
      .then(result=>console.log(`${result.user.email} You are logout!`))
      .catch(error=>console.log(`${error.code}: ${error.message}`))
  }

  handleUpload(event){
    const file = event.target.files[0]
    const storageRef = firebase.storage().ref(`/photos/${file.name}`)
    const task = storageRef.put(file)    

    task.on('state_changed', snapshot=>{
        let percentage = (snapshot.bytesTransferred/snapshot.totalBytes) * 100
        this.setState({
            uploadValue: percentage
        })
    }, error=>{
        console.log(error.message)
    }, ()=>{        
        const record = {
          photoURL: this.state.user.photoURL,
          displayName: this.state.user.displayName,
          image: task.snapshot.downloadURL
        }

        const dbRef = firebase.database().ref('pictures')
        const newPicture = dbRef.push()
        newPicture.set(record)   
    })
  }

  renderLoginButton(){
    if(this.state.user){
      return(
        <div>
          <div className="user">
            Hey! <span>{this.state.user.displayName}</span>
            <img src={this.state.user.photoURL} alt={this.state.user.displayName} style={{width: '40px', marginLeft: '15px', marginRight: '15px'}}/>
            <button onClick={this.handleLogout}><i className="fas fa-sign-out-alt"></i></button> 
          </div>
                             
          <FileUpload onUpload={this.handleUpload} uploadValue={this.state.uploadValue} />
          <div className="gallery">
            {
              this.state.pictures.map(picture=>(
                <div className="card-picture">
                  <img src={picture.image} alt=""/>
                  <br/>
                  <img width="50" src={picture.photoURL} alt={picture.displayName}/>
                  <br/>
                  <span>{picture.displayName}</span>
                
                </div>
              )).reverse()
            }
          </div>
          
        </div>
      )
    }else{
      return(
        <button onClick={this.handleAuth}>Login with Google</button>
      )      
    }
  }

  render() {
    return (
      <div className="wrapper">
        <header className="header">          
          <h1 className="title"><img width="250" src="https://upload.wikimedia.org/wikipedia/commons/9/94/PC_Gamer_logo.png" alt="PAGE GAMER"/></h1>
        </header>
        <div className="content">
          <div className="intro">
            {this.renderLoginButton()}
          </div>
        </div>       
      </div>
    );
  }
}

export default App;
