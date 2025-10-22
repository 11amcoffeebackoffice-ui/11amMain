const deliverModal = document.getElementById("deliverModal");
    const deliverExpressBtn = document.getElementById("deliverExpressBtn");
	const deliverExpressCheckBtn = document.getElementById('deliverExpressCheckBtn');
	const deliverExpressBtnMobile = document.getElementById('deliverExpressBtnMobile');	
    const deliverModalClose = document.getElementById("deliverModalClose");
    const input = document.getElementById("deliver-pickup-address");
    const suggestionsBox = document.getElementById("deliver-suggestions");
    const notAvailableMsg = document.getElementById("deliver-not-available");
    const API_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImNjMmRjN2QwZjhjODQ0MDc4MjQwYWE2Y2FhZmIyYzEzIiwiaCI6Im11cm11cjY0In0=";

    let deliverPickupCoordinates = null;
    let debounceTimer;

    // ===== Open/Close modal =====
	if (deliverExpressBtn) {
	  deliverExpressBtn.onclick = () => (deliverModal.style.display = "flex");
	}

	if (deliverModalClose) {
	  deliverModalClose.onclick = () => (deliverModal.style.display = "none");
	}

	if (deliverModal) {
	  deliverModal.onclick = (e) => {
		if (e.target === deliverModal) deliverModal.style.display = "none";
	  };
	}

	if (deliverExpressCheckBtn) {
	  deliverExpressCheckBtn.onclick = () => (deliverModal.style.display = "flex");
	}

	if (deliverExpressBtnMobile) {
	  deliverExpressBtnMobile.onclick = () => (deliverModal.style.display = "flex");
	}

	
    // ===== Live autocomplete =====
    input.addEventListener("input", function () {
      clearTimeout(debounceTimer);
      const query = this.value.trim();
      if (query.length < 3) {
        suggestionsBox.style.display = "none";
        return;
      }
      debounceTimer = setTimeout(() => fetchSuggestions(query), 300);
    });

    async function fetchSuggestions(query) {
      try {
        const res = await fetch(
          `https://api.openrouteservice.org/geocode/autocomplete?api_key=${API_KEY}&text=${encodeURIComponent(
            query
          )}&boundary.country=MY`
        );
        const data = await res.json();

        if (!data.features || data.features.length === 0) {
          suggestionsBox.style.display = "none";
          return;
        }

        suggestionsBox.innerHTML = "";
        data.features.forEach((feature) => {
          const div = document.createElement("div");
          div.className = "deliver-suggestion-item";
          div.textContent = feature.properties.label;
          div.onclick = () => selectSuggestion(feature);
          suggestionsBox.appendChild(div);
        });
        suggestionsBox.style.display = "block";
      } catch (err) {
        console.error("Autocomplete error:", err);
      }
    }

    function selectSuggestion(feature) {
      const [lon, lat] = feature.geometry.coordinates;
      deliverPickupCoordinates = { lat, lng: lon };
      input.value = feature.properties.label;
      suggestionsBox.style.display = "none";
	  document.getElementById('postcodeorder').value = input.value;
    }

    // ===== Route + Fee (no map) =====
    document.getElementById("deliver-calculate-btn").onclick = async function () {
      if (!deliverPickupCoordinates)
        return alert("Select a pickup location first.");

      const deliverDeliveryCoordinates = { lat: 3.118521, lng: 101.74457 }; // Pandan Perdana
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${deliverPickupCoordinates.lng},${deliverPickupCoordinates.lat};${deliverDeliveryCoordinates.lng},${deliverDeliveryCoordinates.lat}?overview=false`;
        const res = await fetch(url);
        const data = await res.json();

        if (!data.routes || data.routes.length === 0)
          throw new Error("No route found");

        const route = data.routes[0];
        const distance = route.distance / 1000;

        // Show distance
        document.getElementById("deliver-result-container").style.display = "block";
        document.getElementById("deliver-distance-display").textContent =
          distance.toFixed(2) + " km";

        // If distance too far
        if (distance => 20) {
          document.getElementById("deliver-delivery-fee").textContent = "–";
          notAvailableMsg.style.display = "block";
          return;
        } else {
          notAvailableMsg.style.display = "none";
        }

        // Otherwise calculate fee
		const deliveryResultEl = document.getElementById('delivery-result');
		
        const fee = calculateFee(distance);
        document.getElementById("deliver-delivery-fee").textContent = "RM " + fee;
		console.error(fee);
		if (deliveryResultEl) deliveryResultEl.value = "RM " + fee;
      } catch (err) {
        console.error(err);
        alert("Route calculation failed");
      }
    };

    function calculateFee(distance) {
      if (distance <= 5) return 5;
      else if (distance <= 10) return 8;
      else if (distance <= 15) return 12;
      else if (distance <= 19) return 16;
      else return "–";
    }