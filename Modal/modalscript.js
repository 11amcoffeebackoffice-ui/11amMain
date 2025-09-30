		// Postcode Checker Functionality
		const deliveryCheckBtn = document.getElementById('deliveryCheckBtn');
		const deliveryCheckBtnNav = document.getElementById('deliveryCheckBtnNav'); // ✅ nav version
		const postcodeModal = document.getElementById('postcodeModal');
		const modalClose = document.getElementById('modalClose');
		const checkBtn = document.getElementById('checkBtn');
		const doneBtn = document.getElementById('doneBtn'); // ✅ added
		const postcodeInput = document.getElementById('postcode');
		const output = document.getElementById('output');

		// Open modal
		function openPostcodeModal() {
		  postcodeModal.classList.add('active');
		  document.body.style.overflow = 'hidden';
		}

		deliveryCheckBtn.addEventListener('click', openPostcodeModal);
		if (deliveryCheckBtnNav) {
		  deliveryCheckBtnNav.addEventListener('click', openPostcodeModal);
		}

		// Reset when typing new postcode
		postcodeInput.addEventListener("input", function () {
		  checkBtn.style.display = "inline-block"; // show Check
		  doneBtn.style.display = "none"; // hide Done
		  output.style.display = "none"; // hide old result
		});

		// Close modal
		function closePostcodeModal() {
		  postcodeModal.classList.remove('active');
		  document.body.style.overflow = '';
		}

		modalClose.addEventListener('click', closePostcodeModal);

		// Close when clicking outside modal
		postcodeModal.addEventListener('click', (e) => {
		  if (e.target === postcodeModal) {
			closePostcodeModal();
		  }
		});

		// Close with ESC key
		document.addEventListener('keydown', (e) => {
		  if (e.key === "Escape" && postcodeModal.classList.contains('active')) {
			closePostcodeModal();
		  }
		});

		// Order Checker Functionality
		const orderCheckBtnOpen = document.getElementById('orderCheckBtnOpen');
		const orderCheckBtnOpenNav = document.getElementById('orderCheckBtnOpenNav'); // ✅ nav version
		const orderModal = document.getElementById('orderModal');
		const orderModalClose = document.getElementById('orderModalClose');
		const checkOrderBtn = document.getElementById('checkOrderBtn');
		const orderIdInput = document.getElementById('orderId');
		const orderOutput = document.getElementById('orderOutput');
		const orderDoneBtn = document.getElementById('orderDoneBtn');

		// Open modal
		function openOrderModal() {
		  orderModal.classList.add('active');
		  document.body.style.overflow = 'hidden';
		}

		orderCheckBtnOpen.addEventListener('click', openOrderModal);
		if (orderCheckBtnOpenNav) {
		  orderCheckBtnOpenNav.addEventListener('click', openOrderModal);
		}

		// Reset when typing new Order ID
		orderIdInput.addEventListener("input", function () {
		  checkOrderBtn.style.display = "inline-block"; // show Check
		  orderDoneBtn.style.display = "none"; // hide Done
		  orderOutput.style.display = "none"; // hide old result
		});

		// Close modal
		function closeOrderModal() {
		  orderModal.classList.remove('active');
		  document.body.style.overflow = '';
		}

		orderModalClose.addEventListener('click', closeOrderModal);

		// Close when clicking outside modal
		orderModal.addEventListener('click', (e) => {
		  if (e.target === orderModal) {
			closeOrderModal();
		  }
		});

		// Close with ESC key
		document.addEventListener('keydown', (e) => {
		  if (e.key === "Escape" && orderModal.classList.contains('active')) {
			closeOrderModal();
		  }
		});
		
		// ✅ Initialize Firebase (only once)
		const firebaseConfig = {
			apiKey: "AIzaSyDjhTc_zNJifXA0AiRrOkzfROC9JuVd2JQ",
			authDomain: "planning-with-ai-e9d7d.firebaseapp.com",
			projectId: "planning-with-ai-e9d7d",
			storageBucket: "planning-with-ai-e9d7d.firebasestorage.app",
			messagingSenderId: "539840620997",
			appId: "1:539840620997:web:e70ac76536f9a0b5e943ac"
		};

		if (!firebase.apps.length) {
		  firebase.initializeApp(firebaseConfig);
		}

		// ✅ Firestore reference
		const db = firebase.firestore();

		// Handle order check
		checkOrderBtn.addEventListener("click", async function () {
		  const orderId = orderIdInput.value.trim();
		  if (orderId === "") {
			orderOutput.innerHTML = "<span style='color:red;'>⚠ Please enter your Order ID.</span>";
			orderDoneBtn.style.display = "none";
			return;
		  }

		  // Show loading
		  orderOutput.style.display = "block";
		  orderOutput.innerHTML = "⏳ Please wait... checking order.";
		  orderDoneBtn.style.display = "none";

		  try {
			// ✅ Firestore (compat style)
			const docSnap = await db.collection("Order").doc(orderId).get();

			if (docSnap.exists) {
			  const data = docSnap.data();
			  orderOutput.innerHTML = `
				✅ <b>Order Found</b><br>
				<b>Name:</b> ${data.CustName || "-"}<br>
				<b>Order ID:</b> ${orderId}<br>
				<b>Status:</b> ${data.Status || "new"}<br>
				<b>Total:</b> ${data.GrandTotal || "-"}<br>
			  `;
			  orderDoneBtn.style.display = "inline-block";
			  checkOrderBtn.style.display = "none";
			} else {
			  orderOutput.innerHTML = "❌ Order not found";
			  orderDoneBtn.style.display = "none";
			}
		  } catch (err) {
			console.error("❌ Error checking order:", err);
			orderOutput.innerHTML = `❌ Error: ${err.message}`;
			orderDoneBtn.style.display = "none";
		  }
		});
 
      // Handle order done
      orderDoneBtn.addEventListener("click", function() {
        window.location.reload();
      });
      // --- Postcode Checker Configuration ---
      const originLat = 3.1345;
      const originLng = 101.7432;
      const maxKm = 11; // allow up to 20 km
      function normalize(pc) {
        if (!pc) return '';
        return pc.replace(/\s+/g, '');
      }

      function isValidMalaysianPostcode(pc) {
        return /^\d{5}$/.test(pc);
      }

      function haversineDistance(lat1, lon1, lat2, lon2) {
        function toRad(x) {
          return x * Math.PI / 180
        }
        const R = 6371;
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
      }
      async function geocodePostcode(postcode) {
        const url = `https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(postcode)}&country=Malaysia&format=json`;
        const res = await fetch(url, {
          headers: {
            'User-Agent': 'CoffeeDeliveryApp/1.0'
          }
        });
        const json = await res.json();
        if (json && json.length) {
          return {
            lat: parseFloat(json[0].lat),
            lng: parseFloat(json[0].lon)
          };
        }
        throw new Error('No results found');
      }
      // --- Delivery Rate Configuration ---
      const baseRates = {
        motorcycle: {
          base: 4,
          perKm: 1.5
        },
        car: {
          base: 7,
          perKm: 1.8
        },
        van: {
          base: 25,
          perKm: 3.5
        }
      };
      // Grab-style capped pricing for motorcycles
      function calculateDeliveryCost(distanceKm) {
        let rate = baseRates.motorcycle;
        let rawCost = rate.base + (rate.perKm * distanceKm);
        if (distanceKm <= 5) {
          return 7; // flat min RM7
        } else if (distanceKm <= 15) {
          return Math.min(rawCost, 19); // cap at RM19
        } else {
          return Math.round(rawCost); // beyond 15 km, round to whole RM
        }
      }
      checkBtn.addEventListener('click', async () => {
        const raw = postcodeInput.value;
        const pc = normalize(raw);
        output.style.display = 'block';
        if (!pc) {
          output.className = 'result no';
          output.textContent = 'Please enter a postcode.';
          return;
        }
        if (!isValidMalaysianPostcode(pc)) {
          output.className = 'result no';
          output.innerHTML = 'Invalid postcode format. Postcode should be exactly 5 digits.';
          return;
        }
        try {
          output.className = 'result';
          output.textContent = 'Checking postcode location and calculating delivery cost…';
          const {
            lat,
            lng
          } = await geocodePostcode(pc);
          const km = haversineDistance(originLat, originLng, lat, lng);
          const deliveryCost = calculateDeliveryCost(km);
          if (km < maxKm) {
            // ✅ Show Done button after result
            doneBtn.style.display = "inline-block";
            // ✅ Hide Check button
            checkBtn.style.display = "none";
            output.className = 'result ok';
            output.innerHTML = `Good news — we deliver to 
																		<strong>${pc}</strong> (≈${Math.round(km)} km away)!
																		<br>
                                    Estimated delivery fee: 
																			<strong>RM${Math.round(deliveryCost)}</strong>`;
          } else {
            doneBtn.style.display = "inline-block";
            // ✅ Hide Check button
            checkBtn.style.display = "none";
            output.className = 'result no';
            output.innerHTML = `Sorry, 
																			<strong>${pc}</strong> is about ${Math.round(km)} km away, which is outside our ${maxKm} km delivery zone.`;
          }
        } catch (err) {
          output.className = 'result no';
          output.textContent = 'Could not find this postcode. Please check and try again.';
        }
      });
      postcodeInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') checkBtn.click();
      });
      // Close modal with Done button
      document.getElementById("doneBtn").addEventListener("click", function() {
        postcodeModal.classList.remove('active');
        document.body.style.overflow = '';
      });
      // Order Form Functionality
      function submitOrder(e) {
        e.preventDefault();
        const msgEl = document.getElementById('formMsg');
        let selected = [];
        let orderTotal = 0;
        // collect packages + qty
        for (let i = 1; i <= 3; i++) {
          const cb = document.querySelector(`[name="package${i}"]`);
          const qty = parseInt(document.querySelector(`[name="qty${i}"]`).value);
          if (cb.checked && qty > 0) {
            const price = parseFloat(cb.getAttribute("data-price"));
            orderTotal += price * qty;
            selected.push({
              package: cb.value,
              qty: qty,
              price: price
            });
          }
        }
        if (selected.length === 0) {
          msgEl.textContent = "⚠️ Please choose at least one package.";
          return;
        }
        // --- Delivery Fee ---
        let deliveryFee = 0;
        const deliveryText = document.querySelector('#output')?.textContent || "";
        const feeMatch = deliveryText.match(/RM(\d+)/);
        if (feeMatch) {
          deliveryFee = parseInt(feeMatch[1]);
        }
        if (deliveryFee === 0) {
          postcodeModal.classList.add('active');
          document.body.style.overflow = 'hidden';
          msgEl.textContent = "⚠️ Please check your delivery fee before placing order.";
          return;
        }
        // --- Free Delivery Logic (Max RM8) ---
        let displayDeliveryFee = deliveryFee;
        let deliveryLabel = "RM" + deliveryFee;
        if (orderTotal >= 104.9) {
          if (deliveryFee <= 8) {
            displayDeliveryFee = 0;
            deliveryLabel = `
																			<s>${deliveryFee}</s>
																			<span style="color:green;font-weight:bold">RM0</span>`;
          } else {
            displayDeliveryFee = deliveryFee - 8;
            deliveryLabel = `
																			<s>${deliveryFee}</s>
																			<span style="color:green;font-weight:bold">RM${displayDeliveryFee}</span>`;
          }
        }
        const grandTotal = orderTotal + displayDeliveryFee;
        // Update summary in customer form
        document.getElementById('orderTotal').textContent = orderTotal.toFixed(2);
        document.getElementById('deliveryFee').innerHTML = deliveryLabel;
        document.getElementById('grandTotal').textContent = grandTotal.toFixed(2);
        // Copy totals into customer info section
        document.getElementById('custOrderTotal').textContent = orderTotal.toFixed(2);
        document.getElementById('custDeliveryFee').innerHTML = deliveryLabel;
        document.getElementById('custGrandTotal').textContent = grandTotal.toFixed(2);
        // Collect package details
        let detailsHtml = "";
        document.querySelectorAll("#orderForm .package").forEach(pkg => {
          let checkbox = pkg.querySelector("input[type=checkbox]");
          let qty = pkg.querySelector("select").value;
          let label = pkg.querySelector("span").textContent;
          if (checkbox.checked && qty > 0) {
            detailsHtml += `
																			<li>${label} — Qty: ${qty}</li>`;
          }
        });
        // Insert into customer summary
        document.getElementById("custOrderDetails").innerHTML = detailsHtml;
        document.getElementById('orderSection').style.display = "none";
        document.getElementById('customerSection').style.display = "block";
        msgEl.textContent = "";
      }
	  