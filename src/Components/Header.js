import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, fs } from "./Config/Firebase";
import { collection, onSnapshot, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

function Header() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDocRef = doc(fs, "tblUsers", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUser({ uid: currentUser.uid, ...userDoc.data() });
        } else {
          console.error("No such user document!");
        }
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let unsubscribe;
    if (user) {
      const cartCollectionRef = collection(fs, `tblUsers/${user.uid}/tblBucket`);
      unsubscribe = onSnapshot(cartCollectionRef, (snapshot) => {
        const cartData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCart(cartData);
      }, (error) => {
        console.error("Error fetching cart: ", error);
      });
    }
    return () => unsubscribe && unsubscribe();
  }, [user]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const handleCartClick = () => {
    if (!user) {
      alert("Please Login First!");
      navigate("/login");
    } else {
      navigate("/cart");
    }
  };

  return (
    <div>
      {/* Navigation */}
      <nav className="navbar navbar-expand-lg navbar-dark fixed-top" id="mainNav" style={{ backgroundColor: 'black'}}>
        <div className="container">
          <Link className="navbar-brand" to="/">
      
            <h2>JUNLIBOG</h2>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarResponsive"
            aria-controls="navbarResponsive"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            Menu
            <i className="fas fa-bars ms-1" />
          </button>
          <div className="collapse navbar-collapse" id="navbarResponsive">
            <ul className="navbar-nav text-uppercase ms-auto py-4 py-lg-0">
         
              <li className="nav-item dropdown">
                {user ? (
                  <>
                    <a
                      className="nav-link dropdown-toggle"
                      href="#"
                      id="userDropdown"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Welcome, {user.FullName}
                    </a>
                    <ul className="dropdown-menu" aria-labelledby="userDropdown">
                      <li className="nav-item">
                        <Link className="dropdown-item" to="/add-products">
                          Add Products
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link className="dropdown-item" to="/add-location">
                          Add Location
                        </Link>
                      </li>
                      <li>
                        <button className="dropdown-item" onClick={handleLogout}>
                          Logout
                        </button>
                      </li>
                    </ul>
                  </>
                ) : (
                  <Link className="nav-link" to="/login">
                    Login | Signup
                  </Link>
                )}
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#" onClick={handleCartClick}>
                  <i className="fas fa-shopping-cart"></i>
                  {user && cart.length > 0 && <span className="badge bg-secondary">{cart.length}</span>}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
  

      
          
       
         
     
    </div>
  );
}

export default Header;
