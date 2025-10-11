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
		
		// Handle order check
		checkOrderBtn.addEventListener("click", async function () {
		  const orderId = orderIdInput.value.trim();
		  if (orderId === "") {
			orderOutput.innerHTML = "<span style='color:red;'>⚠ Please enter your Order ID.</span>";
			orderDoneBtn.style.display = "none";
			return;
		  }
		  
		 console.log("✅ Check Order button clicked", orderId);

		  orderOutput.style.display = "block";
		  orderOutput.innerHTML = "⏳ Please wait... checking order.";
		  orderDoneBtn.style.display = "none";

		  try {
			const response = await fetch("https://checkorder.11amcoffeebackoffice.workers.dev/", {
			  method: "POST",
			  headers: { "Content-Type": "application/json" },
			  body: JSON.stringify({ orderId }),
			});

			const result = await response.json();

			if (result.success) {
			  const order = result.order;

			  // 🎨 Status color mapping
			  const statusColors = {
				new: "#6c757d",          // gray
				pending: "#ff9800",      // orange
				paid: "#2196f3",         // blue
				preparing: "#17a2b8",    // teal
				delivery: "#9c27b0",     // purple
				cancelled: "#dc3545",    // red
				completed: "#28a745"     // green
			  };

			  const statusText = order.Status;
			  const statusColor = statusColors[statusText] || "#333"; // fallback color
			  
			    // 🕒 Convert time to AM/PM format
			  const dateObj = new Date(order.DateTime);
			  const formattedDate = dateObj.toLocaleString("en-US", {
				year: "numeric",
				month: "short",
				day: "numeric",
				hour: "numeric",
				minute: "2-digit",
				hour12: true,
			  });

			  orderOutput.innerHTML = `
				<div style="
				  background: linear-gradient(145deg, #ffffff, #f7f4ef);
				  border: 1px solid #e0dcd5;
				  border-radius: 16px;
				  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
				  padding: 24px 28px;
				  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
				  color: #333;
				  max-width: 420px;
				  margin: 10px auto;
				  line-height: 1.7;
				  transition: all 0.3s ease;
				">
				  <div style="text-align:center; margin-bottom:10px; font-size:18px; font-weight:600; color:#5d4037;">
					  <img 
						src="found.png" 
						alt="Order Found" 
						style="width:60px; height:auto; display:block; margin:0 auto 8px;" 
					  />
					  <div style="font-size:18px; font-weight:600; color:#5d4037;">
						Order Found
					  </div>
				  </div>
				  <div style="border-top:1px solid #eee; margin:10px 0 15px;"></div>
				  <p style="margin:6px 0;"><b style="color:#555;">Name:</b> ${order.CustName}</p>
				  <p style="margin:6px 0;"><b style="color:#555;">Order ID:</b> ${order.orderId}</p>
				  <p style="margin:6px 0;">
					<b style="color:#555;">Status:</b>
					<span style="
					  background:${statusColor};
					  color:#fff;
					  padding:3px 10px;
					  border-radius:20px;
					  font-weight:600;
					  font-size:13px;
					  display:inline-block;
					">
					  ${statusText.toUpperCase()}
					</span>
				  </p>
				  <p style="margin:6px 0;"><b style="color:#555;">Total:</b> <span style="color:#b8860b; font-weight:600;">${order.GrandTotal}</span></p>
				        <p style="margin:6px 0;">
							<b style="color:#555;">Date:</b> ${formattedDate}
						</p>
				</div>
			  `;

			  orderDoneBtn.style.display = "inline-block";
			  checkOrderBtn.style.display = "none";
			} else {
			  orderOutput.innerHTML = `❌ ${result.error || "Order not found"}`;
			}
		  } catch (err) {
			console.error("❌ Error:", err);
			orderOutput.innerHTML = `
				<div style="
				  background:#fff8f8;
				  border:1px solid #f5c2c7;
				  border-radius:12px;
				  padding:16px;
				  color:#b71c1c;
				  font-family:'Segoe UI', sans-serif;
				  max-width:420px;
				  margin:auto;
				  text-align:center;
				  box-shadow:0 4px 10px rgba(0,0,0,0.05);
				">
				  ❌ ${result.error || "Order not found"}
				</div>
			  `;
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
	  