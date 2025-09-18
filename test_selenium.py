from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time, random

driver = webdriver.Chrome()
wait = WebDriverWait(driver, 8)


# ======================
# SIGNUP FLOW
# ======================
def signup_flow(name, password):
    driver.get("http://localhost:3000/signup")
    email = f"user_{random.randint(1000,9999)}@gmail.com"

    wait.until(EC.presence_of_element_located((By.XPATH, "//input[@placeholder='Name']"))).send_keys(name)
    driver.find_element(By.XPATH, "//input[@placeholder='Email']").send_keys(email)
    driver.find_element(By.XPATH, "//input[@placeholder='Password']").send_keys(password)
    driver.find_element(By.XPATH, "//input[@placeholder='Confirm Password']").send_keys(password)
    driver.find_element(By.XPATH, "//button[contains(text(), 'Sign Up')]").click()

    time.sleep(1)

    success = False
    message = "⚠️ No redirect or popup detected"

    try:
        wait.until(lambda d: "/login" in d.current_url)
        success = True
        message = "✅ Redirected to login"
    except:
        try:
            alert = wait.until(EC.presence_of_element_located((By.CLASS_NAME, "swal2-popup")))
            message = f"Popup: {alert.text}"
        except:
            pass

    return success, message, email


# ======================
# LOGIN FLOW
# ======================
def login_flow(email, password):
    driver.get("http://localhost:3000/login")

    wait.until(EC.presence_of_element_located((By.XPATH, "//input[@placeholder='Email']"))).send_keys(email)
    driver.find_element(By.XPATH, "//input[@placeholder='Password']").send_keys(password)
    driver.find_element(By.XPATH, "//button[contains(text(), 'Log in')]").click()

    try:
        wait.until(lambda d: "login" not in d.current_url)
        driver.get("http://localhost:3000/guitars")
        wait.until(EC.presence_of_element_located((By.XPATH, "//button[contains(text(),'Add to Cart')]")))
        return True, "✅ Logged in and redirected to guitars page"
    except:
        try:
            alert = wait.until(EC.presence_of_element_located((By.CLASS_NAME, "swal2-popup")))
            return False, f"Popup: {alert.text}"
        except:
            return False, "⚠️ No redirect or popup detected"


# ======================
# STOCK TEST
# ======================
def stock_test(quantity):
    driver.get("http://localhost:3000/product/1")  # adjust if route differs
    qty_input = wait.until(EC.presence_of_element_located((By.XPATH, "//input[@type='number']")))
    qty_input.clear()
    qty_input.send_keys(str(quantity))
    driver.find_element(By.XPATH, "//button[contains(text(), 'Add to Cart')]").click()

    time.sleep(10)
    try:
        alert = wait.until(EC.presence_of_element_located((By.CLASS_NAME, "swal2-popup")))
        print(f"   Quantity {quantity}: {alert.text}")
    except:
        print(f"   Quantity {quantity}: ⚠️ No popup detected")


# ======================
# CHECKOUT TEST
# ======================
def checkout_test(expected_success):
    driver.get("http://localhost:3000/cartpage")
    driver.find_element(By.XPATH, "//button[contains(text(), 'Checkout')]").click()

    try:
        alert = wait.until(EC.presence_of_element_located((By.CLASS_NAME, "swal2-popup")))
        if expected_success and "success" in alert.text.lower():
            print(f"✅ Checkout succeeded → {alert.text}")
        elif not expected_success and "error" in alert.text.lower():
            print(f"✅ Correctly blocked empty checkout → {alert.text}")
        else:
            print(f"❌ Checkout wrong behavior → {alert.text}")
    except:
        print("⚠️ No popup detected on checkout")


# ======================
# RUN TESTS
# ======================
print("\n==============================")
print("🔎 PASSWORD → USERNAME → LOGIN → CHECKOUT TESTING")
print("==============================")

# --- WRONG PASSWORD ---
print("\n👉 Password Test:")
success, msg, email = signup_flow("Rin", "1234")
if success:
    print(f"❌ WRONG: Password '1234' accepted → {msg}")
else:
    print(f"✅ Correct: Password '1234' rejected → {msg}")

# --- WRONG USERNAME ---
print("\n👉 Username Test (wrong):")
success, msg, email = signup_flow("Ri", "ValidPass123")
if success:
    print(f"❌ WRONG: Name 'Ri' accepted → {msg}")
else:
    print(f"✅ Correct: Name 'Ri' rejected → {msg}")

# --- CORRECT USERNAME ---
print("\n👉 Username Test (correct):")
success, msg, email = signup_flow("Rin", "ValidPass123")
if success:
    print(f"✅ Correct: Name 'Rin' accepted → {msg}")
    valid_email = email
    valid_password = "ValidPass123"
else:
    print(f"❌ WRONG: Name 'Rin' rejected → {msg}")
    valid_email = None
    valid_password = None

# --- LOGIN + CHECKOUT ---
if valid_email:
    print("\n👉 Login + Checkout Tests:")
    login_success, login_msg = login_flow(valid_email, valid_password)
    if login_success:
        print(f"   {login_msg}")

        print("\n👉 Checkout Validation Tests:")
        checkout_test(False)  # empty cart → error
        stock_test(1)         # add one valid guitar
        checkout_test(True)   # should succeed
    else:
        print(f"❌ Login failed → {login_msg}")

time.sleep(2)
driver.quit()
