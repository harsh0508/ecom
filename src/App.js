import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import MainPage from './Pages/MainPage/MainPage.tsx';
import Header from './Component/Header/Header.tsx';
import Footer from './Component/Footer/Footer.tsx';
import ProductList from './Pages/ProductList/ProductList.tsx';
import Productpage from './Pages/Productpage/Productpage.tsx';
import Authenticate from './Pages/LogInOut/Authenticate.tsx';
import CartPage from './Pages/CartPage/CartPage.tsx';
import CheckOut from './Pages/CheckOut/CheckOut.tsx';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

function App() {

  const web = useSelector((state)=>state.web)


  useEffect(()=>{
    function dragElement(elmnt) {
      var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
      if (document.getElementById(elmnt.id + "-header")) {
        // if present, the header is where you move the DIV from:
        document.getElementById(elmnt.id + "-header").onmousedown = dragMouseDown;
      } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
      }
    
      function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
      }
    
      function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
      }
    
      function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
      }
    }
    dragElement(document.getElementById("r-box"));

  },[])


  return (
    <div className="App">
      <div id='r-box' className='redux-box' style={{width:'400px',height:'200px',backgroundColor:'wheat',position:'fixed',zIndex:'20'}}>
        <div id='r-box-header' style={{height:'20%',width:'100%',backgroundColor:"green"}}>
          Dragabble redux box
        </div>
        <div style={{height:'80%',width:'100%',backgroundColor:'whitesmoke',overflowY:'scroll',flexDirection:'column-reverse'}}>
          {web.text.map((e,i)=><p>{`${i}. ${e}`}</p>)}
        </div>
      </div>
      <BrowserRouter>
        <div style={{position:'fixed',zIndex:'10',margin:'auto'}}><Header/></div>
        <div style={{width:'100vw',height:'100px'}}></div>
        <Routes>
          <Route path='/' element={<MainPage/>}/>
          <Route path='/products/:id' element={<ProductList/>}/>
          <Route path='/pro/:pid' element={<Productpage/>}/>
          <Route path='/login' element={<Authenticate/>}/>
          <Route path = '/cart' element={<CartPage/>}/>
          <Route path = '/checkout' element={<CheckOut/>}/>
        </Routes>
      </BrowserRouter>
      <Footer/>
    </div>
  );
}

export default App;
