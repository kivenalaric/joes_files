(function () {

    // Load jsPDF dynamically
    function loadJsPDF() {
        return new Promise(function (resolve, reject) {
            if (window.jspdf) return resolve();
            const script = document.createElement("script");
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.2/jspdf.umd.min.js";
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    loadJsPDF().then(function () {

    const FRYE_LOCATION_ID = "oUKKuxKyYWHUoncYOKhr";

    // ── Helpers ──`

    function getLocationId() {
        const match = window.location.href.match(/\/location\/([^/]+)/);
        return match ? match[1] : null;
    }

    function getOpportunityName() {
        const el = document.querySelector(".ui-modal-heading .title");
        return el ? el.textContent.trim() : "";
    }

    function getContactId() {
        const el = document.querySelector("[data-contact-id]");
        return el ? el.getAttribute("data-contact-id") : null;
    }

    // Read a field value by its label text from the opportunity card
    function getFieldByLabel(label) {
        const allItems = document.querySelectorAll(".hr-form-item");
        for (const item of allItems) {
            const labelEl = item.querySelector(".hr-form-item-label__text, .n-form-item-label__text");
            if (!labelEl) continue;
            if (labelEl.textContent.trim() !== label) continue;

            // Check for dropdown
            const dropdown = item.querySelector(
                ".hr-base-selection-input__content, .n-base-selection-input__content"
            );
            if (dropdown) {
                const val = dropdown.textContent.trim();
                if (val && !val.includes("Select") && !val.includes("Choose")) return val;
            }

            // Check for text input
            const input = item.querySelector("input[type='text'], input:not([type='radio']):not([type='checkbox'])");
            if (input && input.value) return input.value.trim();

            // Check for textarea
            const textarea = item.querySelector("textarea");
            if (textarea && textarea.value) return textarea.value.trim();

            // Check for radio buttons
            const checkedRadio = item.querySelector("input[type='radio']:checked");
            if (checkedRadio) return checkedRadio.value;

            // Check for checkbox
            const checkbox = item.querySelector("[role='checkbox']");
            if (checkbox) return checkbox.getAttribute("aria-checked") === "true" ? "Yes" : "No";

            // Check for date picker
            const dateInput = item.querySelector(".n-input__input-el, .hr-input__input-el");
            if (dateInput && dateInput.value) return dateInput.value.trim();

            // Fallback: raw text content after the label
            const allText = item.textContent.replace(label, "").trim();
            if (allText && allText.length < 200) return allText;

            return "";
        }
        return "";
    }

    // Read a radio field value
    function getRadioByLabel(label) {
        const allItems = document.querySelectorAll(".hr-form-item");
        for (const item of allItems) {
            const labelEl = item.querySelector(".hr-form-item-label__text, .n-form-item-label__text");
            if (!labelEl || labelEl.textContent.trim() !== label) continue;
            const checked = item.querySelector("input[type='radio']:checked");
            return checked ? checked.value : "";
        }
        return "";
    }

    // ── Scrape all fields from the opportunity card ──

    function scrapeFields() {
        const data = {};

        // Opportunity name = Charges
        data.charges = getOpportunityName();

        // ── Page 1 fields ──
        data.consultStatus = getFieldByLabel("Consult Status") || getRadioByLabel("Consult Status");
        data.consultType = getFieldByLabel("Consult Type") || getRadioByLabel("Consult Type");
        data.matterQualified = getFieldByLabel("Matter Qualified") || getRadioByLabel("Matter Qualified");
        data.date = getFieldByLabel("Date") || getFieldByLabel("Consult Date");
        data.time = getFieldByLabel("Time") || getFieldByLabel("Consult Time");
        data.intaker = getFieldByLabel("Intaker");
        data.scheduledBy = getFieldByLabel("Scheduled by") || getFieldByLabel("Scheduled By");
        data.reasonNotQualified = getFieldByLabel("Reason not qualified") || getFieldByLabel("Reason Not Qualified");
        data.staff = getFieldByLabel("Staff");

        // Contact info
        data.pncFirstName = getFieldByLabel("PNC First Name") || getFieldByLabel("First Name") || "";
        data.pncLastName = getFieldByLabel("PNC Last Name") || getFieldByLabel("Last Name") || "";
        data.pncName = data.pncFirstName && data.pncLastName
            ? data.pncFirstName + " " + data.pncLastName
            : getFieldByLabel("PNC Name") || getFieldByLabel("Contact Name") || "";
        data.dob = getFieldByLabel("DOB") || getFieldByLabel("Date of Birth") || "";
        data.phone = getFieldByLabel("Phone") || getFieldByLabel("PNC Phone") || "";
        data.email = getFieldByLabel("Email") || getFieldByLabel("PNC Email") || "";
        data.mailingAddress = getFieldByLabel("Mailing Address") || getFieldByLabel("Address") || "";
        data.militaryStatus = getFieldByLabel("Military Status") || "";
        data.legalStatus = getFieldByLabel("Legal Status") || "";

        // Case details
        data.doi = getFieldByLabel("DoI") || getFieldByLabel("Date of Incident") || "";
        data.doa = getFieldByLabel("DoA") || getFieldByLabel("Date of Arrest") || "";
        data.court = getFieldByLabel("Court") || "";
        data.county = getFieldByLabel("County") || "";

        // Notes & text areas
        data.incidentNotes = getFieldByLabel("Incident Notes") || getFieldByLabel("Other Notes") || "";
        data.involvedParties = getFieldByLabel("Involved Parties") || "";
        data.priors = getFieldByLabel("Priors") || getFieldByLabel("Prior charges/arrests") || "";
        data.employer = getFieldByLabel("Employer/Employment") || getFieldByLabel("Employer") || "";
        data.employmentImpact = getFieldByLabel("Employment Impact") || "";
        data.medicalDiagnosis = getFieldByLabel("Medical Diagnosis/Meds") || getFieldByLabel("Medical Diagnosis") || "";

        // ── Page 2 fields ──
        data.attorneyNotes = getFieldByLabel("Attorney Notes") || "";
        data.desiredOutcome = getFieldByLabel("Desired Outcome") || "";
        data.biggestConcerns = getFieldByLabel("Biggest Concerns") || "";
        data.todoIfRetained = getFieldByLabel("To Do if Retained") || getFieldByLabel("To Do If Retained") || "";
        data.assignTo = getFieldByLabel("Assign To") || getFieldByLabel("Assigned To") || "";

        // Emergency contact
        data.emergencyContact = getFieldByLabel("Emergency Contact") || "";
        data.relationshipToPNC = getFieldByLabel("Relationship to PNC") || getFieldByLabel("Relationship To PNC") || "";
        data.emergencyPhone = getFieldByLabel("Emergency Contact Phone") || "";
        data.emergencyEmail = getFieldByLabel("Emergency Contact Email") || "";

        // Retainer / payment
        data.retainerOnly = getFieldByLabel("Retainer Only") || "";
        data.retainerPlusTrial = getFieldByLabel("Retainer + Trial") || "";
        data.singlePaymentRetainer = getRadioByLabel("Single Payment Retainer") || getFieldByLabel("Single Payment Retainer") || "";
        data.paymentPlan = getRadioByLabel("Payment Plan") || getFieldByLabel("Payment Plan") || "";
        data.noRetainerReferTo = getFieldByLabel("No Retainer; Reject or Refer to") || getFieldByLabel("Reject or Refer to") || "";
        data.other = getFieldByLabel("Other") || "";
        data.dueAtSigning = getFieldByLabel("Due at Signing") || getFieldByLabel("Due At Signing") || "";
        data.numInstallments = getFieldByLabel("Number of Installments") || getFieldByLabel("# of Installments") || "";
        data.dueDate = getFieldByLabel("Due Date") || getFieldByLabel("Installment Due Day") || "";
        data.startDate = getFieldByLabel("Start Date") || getFieldByLabel("Installment Start Month") || "";
        data.cashDiscount = getFieldByLabel("Cash Discount") || "";
        data.cashDiscountPaidBy = getFieldByLabel("Cash Discount Paid By") || getFieldByLabel("if paid by") || "";

        // ── Page 3 fields ──
        data.courtesyDiscount = getFieldByLabel("Courtesy Discount") || "";
        data.courtesyNotes = getFieldByLabel("Courtesy Discount Notes") || "";
        data.calendarFeePaid = getFieldByLabel("Calendar Fee Paid") || "";
        data.reasonWaived = getFieldByLabel("Reason Waived") || "";

        return data;
    }

    // ── PDF Generation ──

    function generatePDF(data) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF("p", "mm", "letter"); // 215.9 x 279.4mm

        const pageW = 215.9;
        const margin = 15;
        const contentW = pageW - margin * 2;
        let y = 15;

        function setFont(style, size) {
            doc.setFont("helvetica", style);
            doc.setFontSize(size);
        }

        function drawLine(y1, x1, x2) {
            doc.setDrawColor(0);
            doc.setLineWidth(0.3);
            doc.line(x1 || margin, y1, x2 || pageW - margin, y1);
        }

        function labelValue(label, value, x, y1, labelW, valueW) {
            setFont("bold", 9);
            doc.text(label, x, y1);
            setFont("normal", 9);
            const labelTextW = doc.getTextWidth(label);
            doc.text(value || "", x + (labelW || labelTextW + 2), y1);
            if (valueW) {
                drawLine(y1 + 1, x + (labelW || labelTextW + 2), x + (labelW || labelTextW + 2) + valueW);
            }
        }

        function checkbox(label, checked, x, y1) {
            doc.setDrawColor(0);
            doc.setLineWidth(0.3);
            doc.rect(x, y1 - 3, 3.5, 3.5);
            if (checked) {
                doc.setFont("helvetica", "bold");
                doc.setFontSize(9);
                doc.text("X", x + 0.5, y1);
            }
            setFont("normal", 9);
            doc.text(label, x + 5, y1);
        }

        function textBox(content, x, y1, w, h) {
            doc.setDrawColor(0);
            doc.setLineWidth(0.3);
            doc.rect(x, y1, w, h);
            if (content) {
                setFont("normal", 8);
                const lines = doc.splitTextToSize(content, w - 4);
                doc.text(lines, x + 2, y1 + 4);
            }
            return y1 + h;
        }

        function checkIfMatch(fieldValue, matchValue) {
            if (!fieldValue) return false;
            return fieldValue.toLowerCase().includes(matchValue.toLowerCase());
        }

        // ════════════════════════════════════════
        // PAGE 1
        // ════════════════════════════════════════

        // Header
        setFont("bold", 20);
        doc.text("Initial Consultation Form", pageW - margin, y + 5, { align: "right" });

        // Frye Law Group text placeholder (logo area)
        setFont("bold", 14);
        doc.text("FRYE", margin + 5, y + 2);
        setFont("normal", 7);
        doc.text("LAW GROUP, LLC", margin + 2, y + 6);
        setFont("italic", 5);
        doc.text("RELENTLESS DEFENSE", margin, y + 9);

        y += 18;
        drawLine(y);
        y += 6;

        // Row 1: Consult Status | Consult Type | Matter Qualified | Date/Time/Intaker/Scheduled by
        setFont("bold", 9);
        doc.text("Consult Status:", margin, y);
        doc.text("Consult Type:", margin + 45, y);
        doc.text("Matter Qualified:", margin + 90, y);
        doc.text("Date:", margin + 135, y);
        setFont("normal", 9);
        doc.text(data.date || "", margin + 147, y);
        drawLine(y + 1, margin + 147, pageW - margin);

        y += 5;
        checkbox("Completed", checkIfMatch(data.consultStatus, "Completed"), margin, y);
        checkbox("In Person", checkIfMatch(data.consultType, "In Person"), margin + 45, y);
        checkbox("Yes", checkIfMatch(data.matterQualified, "Yes"), margin + 90, y);
        setFont("bold", 9);
        doc.text("Time:", margin + 135, y);
        setFont("normal", 9);
        doc.text(data.time || "", margin + 147, y);
        drawLine(y + 1, margin + 147, pageW - margin);

        y += 5;
        checkbox("Cancelled", checkIfMatch(data.consultStatus, "Cancelled"), margin, y);
        checkbox("Zoom", checkIfMatch(data.consultType, "Zoom"), margin + 45, y);
        checkbox("No", checkIfMatch(data.matterQualified, "No"), margin + 90, y);
        setFont("bold", 9);
        doc.text("Intaker:", margin + 135, y);
        setFont("normal", 9);
        doc.text(data.intaker || "", margin + 152, y);

        y += 5;
        checkbox("No Show", checkIfMatch(data.consultStatus, "No Show"), margin, y);
        checkbox("Phone", checkIfMatch(data.consultType, "Phone"), margin + 45, y);
        setFont("bold", 9);
        doc.text("Scheduled by:", margin + 135, y);
        setFont("normal", 9);
        doc.text(data.scheduledBy || "", margin + 160, y);

        y += 7;
        // Reason not qualified / Staff
        setFont("bold", 9);
        doc.text("Reason not qualified:", margin, y);
        setFont("normal", 9);
        doc.text(data.reasonNotQualified || "", margin + 40, y);
        drawLine(y + 1, margin + 40, margin + 100);
        setFont("bold", 9);
        doc.text("Staff:", margin + 135, y);
        setFont("normal", 9);
        doc.text(data.staff || "", margin + 147, y);
        drawLine(y + 1, margin + 147, pageW - margin);

        y += 7;
        drawLine(y);
        y += 5;

        // PNC Name / DOB
        setFont("bold", 9);
        doc.text("PNC Name:", margin, y);
        setFont("normal", 9);
        doc.text(data.pncName || "", margin + 22, y);
        drawLine(y + 1, margin + 22, margin + 120);
        setFont("bold", 9);
        doc.text("DOB:", margin + 125, y);
        setFont("normal", 9);
        doc.text(data.dob || "", margin + 135, y);

        y += 6;
        // Phone / Email
        labelValue("Phone:", data.phone, margin, y);
        drawLine(y + 1, margin + 16, margin + 80);
        labelValue("Email:", data.email, margin + 90, y);
        drawLine(y + 1, margin + 104, pageW - margin);

        y += 5;
        // Mailing Address
        labelValue("Mailing Address:", data.mailingAddress, margin, y);
        drawLine(y + 1, margin + 33, pageW - margin);

        y += 5;
        // Military Status / Legal Status
        labelValue("Military Status:", data.militaryStatus, margin, y);
        drawLine(y + 1, margin + 32, margin + 80);
        labelValue("Legal Status:", data.legalStatus, margin + 90, y);
        drawLine(y + 1, margin + 117, pageW - margin);

        y += 5;
        // Charges line
        setFont("bold", 9);
        doc.text("Charges:", margin, y);
        setFont("normal", 9);
        const chargeLines = doc.splitTextToSize(data.charges || "", contentW - 20);
        doc.text(chargeLines, margin + 18, y);
        drawLine(y + 1, margin + 18, pageW - margin);

        y += 5;
        // DoI / DoA / Court / County
        labelValue("DoI:", data.doi, margin, y);
        drawLine(y + 1, margin + 10, margin + 35);
        labelValue("DoA:", data.doa, margin + 40, y);
        drawLine(y + 1, margin + 50, margin + 75);
        labelValue("Court:", data.court, margin + 80, y);
        drawLine(y + 1, margin + 93, margin + 120);
        labelValue("County:", data.county, margin + 125, y);
        drawLine(y + 1, margin + 140, pageW - margin);

        y += 8;
        // Incident Notes
        setFont("bold", 10);
        doc.text("Incident Notes:", margin, y);
        y += 2;
        y = textBox(data.incidentNotes, margin, y, contentW, 35);

        y += 3;
        // Involved Parties
        setFont("bold", 10);
        doc.text("Involved Parties:", margin, y);
        y += 2;
        y = textBox(data.involvedParties, margin, y, contentW, 12);

        y += 3;
        // Priors
        setFont("bold", 10);
        doc.text("Priors:", margin, y);
        y += 2;
        y = textBox(data.priors, margin, y, contentW, 12);

        y += 3;
        // Employer/Employment
        setFont("bold", 10);
        doc.text("Employer/Employment:", margin, y);
        setFont("normal", 9);
        doc.text(data.employer || "", margin + 45, y);
        drawLine(y + 1, margin + 45, pageW - margin);

        y += 5;
        // Employment Impact
        setFont("bold", 10);
        doc.text("Employment Impact:", margin, y);
        y += 2;
        y = textBox(data.employmentImpact, margin, y, contentW, 12);

        y += 3;
        // Medical Diagnosis/Meds
        setFont("bold", 10);
        doc.text("Medical Diagnosis/Meds:", margin, y);
        y += 2;
        y = textBox(data.medicalDiagnosis, margin, y, contentW, 12);

        // ════════════════════════════════════════
        // PAGE 2
        // ════════════════════════════════════════
        doc.addPage();
        y = 15;

        // Header
        setFont("bold", 20);
        doc.text("Initial Consultation Form", pageW - margin, y + 5, { align: "right" });
        setFont("bold", 14);
        doc.text("FRYE", margin + 5, y + 2);
        setFont("normal", 7);
        doc.text("LAW GROUP, LLC", margin + 2, y + 6);
        setFont("italic", 5);
        doc.text("RELENTLESS DEFENSE", margin, y + 9);

        y += 18;

        // Attorney Notes
        setFont("bold", 10);
        doc.text("Attorney Notes:", margin, y);
        y += 2;
        y = textBox(data.attorneyNotes, margin, y, contentW, 40);

        y += 5;
        // Desired Outcome / Biggest Concerns
        const halfW = (contentW - 5) / 2;
        setFont("bold", 10);
        doc.text("Desired Outcome:", margin, y);
        doc.text("Biggest Concerns:", margin + halfW + 5, y);
        y += 2;
        // Side by side boxes
        doc.rect(margin, y, halfW, 25);
        doc.rect(margin + halfW + 5, y, halfW, 25);
        if (data.desiredOutcome) {
            setFont("normal", 8);
            const dLines = doc.splitTextToSize(data.desiredOutcome, halfW - 4);
            doc.text(dLines, margin + 2, y + 4);
        }
        if (data.biggestConcerns) {
            setFont("normal", 8);
            const bLines = doc.splitTextToSize(data.biggestConcerns, halfW - 4);
            doc.text(bLines, margin + halfW + 7, y + 4);
        }
        y += 28;

        // To Do if Retained / Assign To
        setFont("bold", 10);
        doc.text("To Do if Retained:", margin, y);
        doc.text("Assign To:", margin + halfW + 5, y);
        y += 2;
        doc.rect(margin, y, halfW, 20);
        doc.rect(margin + halfW + 5, y, halfW, 20);
        if (data.todoIfRetained) {
            setFont("normal", 8);
            const tLines = doc.splitTextToSize(data.todoIfRetained, halfW - 4);
            doc.text(tLines, margin + 2, y + 4);
        }
        if (data.assignTo) {
            setFont("normal", 8);
            const aLines = doc.splitTextToSize(data.assignTo, halfW - 4);
            doc.text(aLines, margin + halfW + 7, y + 4);
        }
        y += 23;

        // Emergency Contact
        labelValue("Emergency Contact:", data.emergencyContact, margin, y);
        drawLine(y + 1, margin + 38, margin + 85);
        labelValue("Relationship to PNC:", data.relationshipToPNC, margin + 90, y);
        drawLine(y + 1, margin + 130, pageW - margin);

        y += 5;
        labelValue("Phone:", data.emergencyPhone, margin, y);
        drawLine(y + 1, margin + 16, margin + 55);
        labelValue("Email:", data.emergencyEmail, margin + 60, y);
        drawLine(y + 1, margin + 74, pageW - margin);

        y += 8;
        // Separator
        doc.setDrawColor(0);
        doc.setLineWidth(0.5);
        doc.setLineDashPattern([2, 2], 0);
        doc.line(margin, y, pageW - margin, y);
        doc.setLineDashPattern([], 0);

        y += 6;
        // Retainer section
        checkbox("Retainer Only: $", false, margin, y);
        setFont("normal", 9);
        doc.text(data.retainerOnly || "", margin + 38, y);
        drawLine(y + 1, margin + 35, margin + 60);

        checkbox("Retainer + Trial: $", false, margin + 70, y);
        setFont("normal", 9);
        doc.text(data.retainerPlusTrial || "", margin + 112, y);
        drawLine(y + 1, margin + 109, margin + 130);
        doc.text("+ $", margin + 131, y);
        drawLine(y + 1, margin + 140, pageW - margin);

        y += 6;
        checkbox("Single Payment Retainer", checkIfMatch(data.singlePaymentRetainer, "Yes") || checkIfMatch(data.singlePaymentRetainer, "Single"), margin, y);
        checkbox("No Retainer; Reject or Refer to", false, margin + 70, y);
        setFont("normal", 9);
        doc.text(data.noRetainerReferTo || "", margin + 128, y);
        drawLine(y + 1, margin + 126, pageW - margin);

        y += 6;
        checkbox("Payment Plan", checkIfMatch(data.paymentPlan, "Yes") || checkIfMatch(data.paymentPlan, "Payment Plan"), margin, y);
        checkbox("Other:", false, margin + 45, y);
        setFont("normal", 9);
        doc.text(data.other || "", margin + 62, y);
        drawLine(y + 1, margin + 60, pageW - margin);

        y += 6;
        labelValue("Due at Signing: $", data.dueAtSigning, margin, y);
        drawLine(y + 1, margin + 35, margin + 55);
        labelValue("# of Installments:", data.numInstallments, margin + 60, y);
        drawLine(y + 1, margin + 95, margin + 110);
        setFont("bold", 9);
        doc.text("Due Date:", margin + 115, y);
        checkbox("10th", checkIfMatch(data.dueDate, "10"), margin + 135, y);
        checkbox("20th", checkIfMatch(data.dueDate, "20"), margin + 152, y);

        y += 6;
        labelValue("Start Date:", data.startDate, margin, y);
        drawLine(y + 1, margin + 24, margin + 50);
        labelValue("Cash Discount of $", data.cashDiscount, margin + 55, y);
        drawLine(y + 1, margin + 93, margin + 110);
        labelValue("if paid by", data.cashDiscountPaidBy, margin + 115, y);
        drawLine(y + 1, margin + 135, pageW - margin);

        // ════════════════════════════════════════
        // PAGE 3
        // ════════════════════════════════════════
        doc.addPage();
        y = 15;

        // Header
        setFont("bold", 20);
        doc.text("Initial Consultation Form", pageW - margin, y + 5, { align: "right" });
        setFont("bold", 14);
        doc.text("FRYE", margin + 5, y + 2);
        setFont("normal", 7);
        doc.text("LAW GROUP, LLC", margin + 2, y + 6);
        setFont("italic", 5);
        doc.text("RELENTLESS DEFENSE", margin, y + 9);

        y += 18;

        // Courtesy Discount
        labelValue("Courtesy Discount: $", data.courtesyDiscount, margin, y);
        drawLine(y + 1, margin + 42, margin + 65);
        labelValue("Notes:", data.courtesyNotes, margin + 70, y);
        drawLine(y + 1, margin + 82, pageW - margin);

        y += 6;
        labelValue("Calendar Fee Paid:", data.calendarFeePaid, margin, y);
        drawLine(y + 1, margin + 37, margin + 50);
        labelValue("Reason Waived:", data.reasonWaived, margin + 55, y);
        drawLine(y + 1, margin + 85, pageW - margin);

        return doc;
    }

    // ── Preview Popup ──

    function showPreviewPopup(pdfDoc, data) {
        // Remove existing popup
        const existing = document.querySelector(".frye-pdf-popup-container");
        if (existing) existing.remove();

        const pdfBlob = pdfDoc.output("blob");
        const pdfUrl = URL.createObjectURL(pdfBlob);

        // Container overlay
        const container = document.createElement("div");
        container.className = "frye-pdf-popup-container";
        container.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.6); z-index: 99999; display: flex;
            align-items: center; justify-content: center;
        `;

        // Popup
        const popup = document.createElement("div");
        popup.className = "frye-pdf-popup";
        popup.style.cssText = `
            background: white; border-radius: 8px; width: 80%; max-width: 900px;
            height: 85vh; display: flex; flex-direction: column;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        `;

        // Header bar
        const header = document.createElement("div");
        header.style.cssText = `
            display: flex; justify-content: space-between; align-items: center;
            padding: 12px 16px; border-bottom: 1px solid #e5e7eb;
        `;

        const title = document.createElement("span");
        title.textContent = "Initial Consultation Form - " + (data.pncName || "Preview");
        title.style.cssText = "font-weight: 600; font-size: 14px;";

        const btnGroup = document.createElement("div");
        btnGroup.style.cssText = "display: flex; gap: 8px;";

        // Download button
        const downloadBtn = document.createElement("button");
        downloadBtn.textContent = "Download PDF";
        downloadBtn.style.cssText = `
            background: #1D2567; color: white; border: none; border-radius: 5px;
            padding: 6px 14px; cursor: pointer; font-size: 13px;
        `;
        downloadBtn.addEventListener("click", function () {
            const fileName = "Consultation_" + (data.pncName || "Form").replace(/\s+/g, "_") + ".pdf";
            pdfDoc.save(fileName);
        });

        // Upload to documents button
        const uploadBtn = document.createElement("button");
        uploadBtn.textContent = "Save to Documents";
        uploadBtn.style.cssText = `
            background: #155EEE; color: white; border: none; border-radius: 5px;
            padding: 6px 14px; cursor: pointer; font-size: 13px;
        `;
        uploadBtn.addEventListener("click", async function () {
            uploadBtn.textContent = "Uploading...";
            uploadBtn.disabled = true;
            try {
                await uploadToDocuments(pdfBlob, data);
                uploadBtn.textContent = "Saved!";
                uploadBtn.style.background = "#16a34a";
            } catch (err) {
                console.error("Upload failed:", err);
                uploadBtn.textContent = "Upload Failed";
                uploadBtn.style.background = "#dc2626";
            }
        });

        // Close button
        const closeBtn = document.createElement("button");
        closeBtn.textContent = "\u00D7";
        closeBtn.style.cssText = `
            background: none; border: none; font-size: 22px; cursor: pointer;
            color: #6b7280; padding: 0 4px;
        `;
        closeBtn.addEventListener("click", function () {
            URL.revokeObjectURL(pdfUrl);
            container.remove();
        });

        btnGroup.appendChild(downloadBtn);
        btnGroup.appendChild(uploadBtn);
        btnGroup.appendChild(closeBtn);
        header.appendChild(title);
        header.appendChild(btnGroup);

        // iframe for PDF preview
        const iframe = document.createElement("iframe");
        iframe.src = pdfUrl;
        iframe.style.cssText = "flex: 1; border: none; border-radius: 0 0 8px 8px;";

        popup.appendChild(header);
        popup.appendChild(iframe);
        container.appendChild(popup);

        // Close on overlay click
        container.addEventListener("click", function (e) {
            if (e.target === container) {
                URL.revokeObjectURL(pdfUrl);
                container.remove();
            }
        });

        document.body.appendChild(container);
    }

    // ── Upload to Contact Documents (GHL API) ──

    async function uploadToDocuments(pdfBlob, data) {
        const contactId = getContactId();
        const locationId = getLocationId();

        if (!contactId || !locationId) {
            throw new Error("Missing contactId or locationId for document upload");
        }

        const fileName = "Consultation_" + (data.pncName || "Form").replace(/\s+/g, "_") + ".pdf";

        const formData = new FormData();
        formData.append("file", pdfBlob, fileName);
        formData.append("name", fileName);

        // Use GHL's internal API to upload document to the contact
        const response = await fetch(
            `/api/internal/documents/contacts/${contactId}/upload`,
            {
                method: "POST",
                body: formData,
                headers: {
                    "Accept": "application/json"
                }
            }
        );

        if (!response.ok) {
            // Fallback: try the alternative endpoint pattern
            const response2 = await fetch(
                `/api/v1/contacts/${contactId}/documents`,
                {
                    method: "POST",
                    body: formData,
                    headers: {
                        "Accept": "application/json"
                    }
                }
            );
            if (!response2.ok) throw new Error("Document upload failed: " + response2.status);
            return response2.json();
        }

        return response.json();
    }

    // ── Button Insertion ──

    let consultBtnAdded = false;

    function insertConsultationBtn() {
        if (!window.location.href.includes("/v2/location/" + FRYE_LOCATION_ID)) return;

        if (consultBtnAdded) return;

        const headerContainer = document.querySelector(".ui-modal-heading .title");
        if (!headerContainer) return;

        // Check not already added
        if (document.querySelector(".frye-consult-pdf-btn")) return;

        const btn = document.createElement("button");
        btn.textContent = "Consultation PDF";
        btn.className = "frye-consult-pdf-btn";
        btn.style.cssText = `
            border: 1px solid grey; background: #1D2567; color: white;
            border-radius: 5px; padding: 2px 10px; margin-left: 8px;
            cursor: pointer; font-size: 12px; vertical-align: middle;
        `;

        btn.addEventListener("click", function (e) {
            e.stopPropagation();
            e.preventDefault();

            btn.textContent = "Generating...";
            btn.disabled = true;

            // Small delay to let DOM settle
            setTimeout(function () {
                try {
                    const data = scrapeFields();
                    const pdfDoc = generatePDF(data);
                    showPreviewPopup(pdfDoc, data);
                    btn.textContent = "Consultation PDF";
                    btn.disabled = false;
                } catch (err) {
                    console.error("PDF generation error:", err);
                    btn.textContent = "Error - Retry";
                    btn.disabled = false;
                }
            }, 300);
        });

        headerContainer.appendChild(btn);
        consultBtnAdded = true;
    }

    // ── Observers ──

    // Watch for opportunity card modal to open
    const bodyObserver = new MutationObserver(function () {
        if (!window.location.href.includes("/v2/location/" + FRYE_LOCATION_ID)) return;

        const modal = document.querySelector(".ui-modal-heading .title");
        if (modal && !document.querySelector(".frye-consult-pdf-btn")) {
            consultBtnAdded = false;
            insertConsultationBtn();
        }
    });

    bodyObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Re-run on route change
    window.addEventListener("routeChangeEvent", function () {
        consultBtnAdded = false;
        setTimeout(insertConsultationBtn, 1000);
    });

    // Initial run
    setTimeout(insertConsultationBtn, 1500);

    }).catch(function (err) {
        console.error("Failed to load jsPDF:", err);
    });

})();
