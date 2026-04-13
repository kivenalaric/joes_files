<!-- dee -->

<script>
let contactId;
let opportunityId;
let locationId = window?.location?.href?.split("/")[5]
let cardInterval;
let btn_text = "Push Data";
const contactCache = new Map();

console.log("MIN PRACTICE Alan CARDS+++++");


window.addEventListener("routeChangeEvent", function (eev) {
    console.log("Route changed");
    if (eev.detail.to.name === "opportunities-list-v2" && eev?.detail?.to?.params?.location_id == "mjCC6SNVAuOqH9rU3VaG") {
        getInfo()
    } else {
        clearInterval(cardInterval);
    }
})

function getInfo() {
    cardInterval = setInterval(() => {
        let cards = document.querySelectorAll(".ui-card .ui-card-content [data-contact-id]");
        if (cards.length > 0) {
            cards.forEach(element => {
                let parenDiv = element.parentElement

                if (!parenDiv.classList.contains("minpractice")) {
                    parenDiv.classList.add("minpractice");
                    let cId = element.getAttribute("data-contact-id");
                    let oId = element.getAttribute("id");
                    createBTn(parenDiv, cId, oId);
                    prefetchContact(cId);
                }
            });
        }
    }, 500);
}


function createBTn(parenDiv, cId, oId) {
    let btn = document.createElement("div");
    btn.classList.add("contact_buttons_practice");
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-brush-fill" viewBox="0 0 16 16">
<path d="M15.825.12a.5.5 0 0 1 .132.584c-1.53 3.43-4.743 8.17-7.095 10.64a6.1 6.1 0 0 1-2.373 1.534c-.018.227-.06.538-.16.868-.201.659-.667 1.479-1.708 1.74a8.1 8.1 0 0 1-3.078.132 4 4 0 0 1-.562-.135 1.4 1.4 0 0 1-.466-.247.7.7 0 0 1-.204-.288.62.62 0 0 1 .004-.443c.095-.245.316-.38.461-.452.394-.197.625-.453.867-.826.095-.144.184-.297.287-.472l.117-.198c.151-.255.326-.54.546-.848.528-.739 1.201-.925 1.746-.896q.19.012.348.048c.062-.172.142-.38.238-.608.261-.619.658-1.419 1.187-2.069 2.176-2.67 6.18-6.206 9.117-8.104a.5.5 0 0 1 .596.04"/>
</svg>`;

    parenDiv?.children[2]?.appendChild(btn);
    btn.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        performRequest(cId, oId);
    });
}


function injectModalStyles() {
    if (document.getElementById("mp-modal-styles")) return;
    const style = document.createElement("style");
    style.id = "mp-modal-styles";
    style.textContent = `
        .mp-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5); z-index: 99999;
            display: flex; align-items: center; justify-content: center;
            padding: 24px 16px;
        }
        .mp-modal {
            background: #fff; border-radius: 10px; padding: 0;
            width: 95vw; max-width: 1200px; height: 90vh;
            box-shadow: 0 8px 30px rgba(0,0,0,0.2); font-family: sans-serif;
            display: flex; flex-direction: column; overflow: hidden;
        }
        .mp-modal-header {
            flex-shrink: 0;
            display: flex; justify-content: space-between; align-items: center;
            padding: 16px 20px; border-bottom: 1px solid #e5e7eb;
            background: #fff; border-radius: 10px 10px 0 0; z-index: 10;
        }
        .mp-modal-header h3 { margin: 0; font-size: 16px; color: #111827; font-weight: 600; }
        .mp-modal-lead-meta { font-size: 12px; color: #6b7280; margin-top: 2px; }
        .mp-close-btn {
            background: none; border: none; font-size: 20px; cursor: pointer;
            color: #6b7280; line-height: 1; padding: 4px 8px; border-radius: 4px;
        }
        .mp-close-btn:hover { background: #f3f4f6; color: #111827; }

        /* Contact banner */
        .mp-contact-banner {
            flex-shrink: 0;
            background: #fafafa; border-bottom: 1px solid #e5e7eb;
            padding: 12px 20px; display: flex; align-items: center; gap: 20px; flex-wrap: wrap;
        }
        .mp-stars { color: #d97706; font-size: 16px; letter-spacing: 2px; }
        .mp-case-type { font-size: 11px; color: #6b7280; margin-top: 2px; }
        .mp-contact-item { display: flex; align-items: center; gap: 6px; font-size: 13px; color: #374151; }
        .mp-contact-item a { color: #2563eb; text-decoration: none; }

        /* Body */
        .mp-body { flex: 1; overflow-y: auto; padding: 20px; }

        /* Section header */
        .mp-section-header {
            font-size: 11px; font-weight: 700; color: #6b7280;
            text-transform: uppercase; letter-spacing: .6px;
            border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; margin: 16px 0 10px;
        }
        .mp-section-header:first-child { margin-top: 0; }

        /* Form grid */
        .mp-form-row { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 10px; }
        .mp-col-3 { flex: 1; min-width: 160px; max-width: 33%; }
        .mp-col-4 { flex: 1; min-width: 180px; max-width: 50%; }
        .mp-col-6 { flex: 1; min-width: 240px; }
        .mp-col-12 { flex: 1 1 100%; }

        /* Labels / inputs */
        .mp-label {
            display: block; font-size: 11px; font-weight: 600;
            color: #374151; margin-bottom: 3px; text-transform: uppercase; letter-spacing: .3px;
        }
        .mp-label small { display: block; font-size: 10px; color: #9ca3af; text-transform: none; letter-spacing: 0; font-weight: 400; }
        .mp-input, .mp-select, .mp-textarea {
            width: 100%; padding: 6px 9px; border: 1px solid #d1d5db;
            border-radius: 6px; font-size: 13px; color: #111827;
            box-sizing: border-box; background: #f9fafb; font-family: sans-serif;
        }
        .mp-input:focus, .mp-select:focus, .mp-textarea:focus {
            outline: none; border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.15);
            background: #fff;
        }
        .mp-textarea { resize: vertical; min-height: 48px; }

        /* Radio group */
        .mp-radio-group { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 4px; }
        .mp-radio-item { display: flex; align-items: center; gap: 5px; font-size: 13px; cursor: pointer; color: #374151; }
        .mp-radio-item input { cursor: pointer; accent-color: #3b82f6; }

        /* Checkbox group */
        .mp-check-group { display: flex; flex-direction: column; gap: 3px; margin-top: 4px; }
        .mp-check-item { display: flex; align-items: center; gap: 6px; font-size: 13px; cursor: pointer; color: #374151; }
        .mp-check-item input { cursor: pointer; accent-color: #3b82f6; }

        /* Alert */
        .mp-alert-danger {
            background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px;
            padding: 7px 12px; font-size: 13px; color: #b91c1c; font-weight: 500;
            margin-bottom: 8px;
        }

        /* Filevine chip */
        .mp-fv-chip {
            display: inline-flex; align-items: center; gap: 8px;
            background: #f3f4f6; border: 1px solid #d1d5db; border-radius: 6px;
            padding: 5px 10px; font-size: 13px; color: #374151; margin-bottom: 4px;
        }
        .mp-fv-chip span { font-size: 13px; color: #2563eb; }
        .mp-fv-chip button { background: none; border: none; cursor: pointer; color: #9ca3af; font-size: 14px; padding: 0 2px; }

        /* Concussion grid */
        .mp-concussion-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 8px; }
        .mp-concussion-item { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 8px 10px; }
        .mp-clabel { font-size: 11px; color: #6b7280; margin-bottom: 4px; font-weight: 500; }
        .mp-scale-row { display: flex; gap: 4px; }
        .mp-scale-radio { display: flex; flex-direction: column; align-items: center; gap: 2px; font-size: 10px; color: #9ca3af; }
        .mp-scale-radio input { width: 14px; height: 14px; }

        /* Hidden */
        .mp-hidden { display: none !important; }

        /* Save bar */
        .mp-save-bar {
            flex-shrink: 0; background: #fff;
            border-top: 1px solid #e5e7eb; padding: 12px 20px;
            display: flex; gap: 10px; align-items: center;
            border-radius: 0 0 10px 10px;
        }
        .mp-btn-primary {
            background: #2563eb; color: #fff; border: none;
            border-radius: 6px; padding: 8px 16px; font-size: 13px; font-weight: 500; cursor: pointer;
        }
        .mp-btn-primary:hover { background: #1d4ed8; }
        .mp-btn-white {
            background: #fff; color: #374151; border: 1px solid #d1d5db;
            border-radius: 6px; padding: 8px 16px; font-size: 13px; cursor: pointer;
        }
        .mp-btn-white:hover { background: #f9fafb; }
        .mp-req { color: #ef4444; margin-left: 2px; }
    `;
    document.head.appendChild(style);
}


function showContactModal(contact) {
    injectModalStyles();

    const existing = document.getElementById("mp-contact-overlay");
    if (existing) existing.remove();

    const overlay = document.createElement("div");
    overlay.id = "mp-contact-overlay";
    overlay.className = "mp-overlay";

    overlay.innerHTML = `
        <div class="mp-modal">

            <!-- ── Header ── -->
            <div class="mp-modal-header">
                <div>
                    <h3>Mr. ${contact.firstName || ""} ${contact.lastName || ""}</h3>
                    <div class="mp-modal-lead-meta">Lead Docket · Edit Lead · Incident Tab</div>
                </div>
                <button class="mp-close-btn" title="Close">&times;</button>
            </div>

            <!-- ── Contact banner ── -->
            <div class="mp-contact-banner">
                <div>
                    <div class="mp-stars">★★★</div>
                    <div class="mp-case-type">🚗 MVA 2026</div>
                </div>
                <div class="mp-contact-item">📞 <a href="tel:${contact.phone || ''}">${contact.phone || "(504) 228-9727"}</a> <span style="font-size:11px;color:#9ca3af">(mobile)</span></div>
                <div class="mp-contact-item">✉ <a href="#">${contact.email || ""}</a></div>
            </div>

            <!-- ── Form Body ── -->
            <div class="mp-body">

                <!-- ════ Personal Information ════ -->
                <div class="mp-section-header">Personal Information</div>

                <div class="mp-form-row">
                    <div class="mp-col-4">
                        <label class="mp-label">Have you spoken to another attorney about your case?</label>
                        <div class="mp-radio-group">
                            <label class="mp-radio-item"><input type="radio" name="mp_f15" value="Yes" onchange="mpDep(15,'Yes')"> Yes</label>
                            <label class="mp-radio-item"><input type="radio" name="mp_f15" value="No" onchange="mpDep(15,'No')" checked> No</label>
                            <label class="mp-radio-item"><input type="radio" name="mp_f15" value="" onchange="mpDep(15,'')"> Unknown</label>
                        </div>
                    </div>
                    <div class="mp-col-4 mp-hidden" id="mp_d16">
                        <label class="mp-label">Did you sign a retainer agreement?</label>
                        <div class="mp-radio-group">
                            <label class="mp-radio-item"><input type="radio" name="mp_f16" value="Yes" onchange="mpDep(16,'Yes')"> Yes</label>
                            <label class="mp-radio-item"><input type="radio" name="mp_f16" value="No" onchange="mpDep(16,'No')"> No</label>
                            <label class="mp-radio-item"><input type="radio" name="mp_f16" value="" onchange="mpDep(16,'')" checked> Unknown</label>
                        </div>
                    </div>
                </div>

                <div class="mp-form-row mp-hidden" id="mp_d17">
                    <div class="mp-col-4">
                        <label class="mp-label">Attorney / Firm</label>
                        <div class="mp-fv-chip"><span>↗</span> Search Filevine Contact <button>✕</button></div>
                    </div>
                    <div class="mp-col-4">
                        <label class="mp-label">Attorney / Firm (text)</label>
                        <textarea class="mp-textarea" placeholder="Enter attorney or firm name..."></textarea>
                    </div>
                </div>

                <!-- Case Type -->
                <div class="mp-form-row">
                    <div class="mp-col-4">
                        <label class="mp-label">Case Type <span class="mp-req">*</span></label>
                        <select class="mp-select" onchange="mpCaseTypeChange(this)">
                            <option value="">-- Choose Case Type --</option>
                            <option value="1">General Personal Injury</option>
                            <option value="5">Hurricane Claim</option>
                            <option value="6">Medical Malpractice</option>
                            <option value="3">MVA</option>
                            <option value="7" selected>MVA 2026</option>
                            <option value="2">Other</option>
                            <option value="-1">Unrelated Practice Area</option>
                            <option value="4">Worker's Compensation</option>
                        </select>
                    </div>
                    <div class="mp-col-6 mp-hidden" id="mp_unrelated">
                        <label class="mp-label">Unrelated Practice Area <span class="mp-req">*</span></label>
                        <input class="mp-input" type="text" maxlength="50" placeholder="Enter practice area...">
                    </div>
                </div>

                <!-- Summary -->
                <div class="mp-form-row">
                    <div class="mp-col-12">
                        <label class="mp-label">Summary <span class="mp-req">*</span>
                            <small>Date and location of accident, police department, passengers, insurance info</small>
                        </label>
                        <textarea class="mp-textarea" rows="3">PC was driving on N. Robinson in the left lane. A gray subaru ran the stop sign, which caused a black Toyota to come into their lane, hitting them.</textarea>
                    </div>
                </div>

                <!-- ════ Initial Qualifiers ════ -->
                <div class="mp-section-header">Initial Qualifiers</div>

                <div class="mp-form-row">
                    <div class="mp-col-3">
                        <label class="mp-label">Do You Have Auto Insurance?</label>
                        <div class="mp-radio-group">
                            <label class="mp-radio-item"><input type="radio" name="mp_f265" value="Yes" onchange="mpDep(265,'Yes')" checked> Yes</label>
                            <label class="mp-radio-item"><input type="radio" name="mp_f265" value="No" onchange="mpDep(265,'No')"> No</label>
                            <label class="mp-radio-item"><input type="radio" name="mp_f265" value="" onchange="mpDep(265,'')"> Unknown</label>
                        </div>
                    </div>
                    <div class="mp-col-3">
                        <label class="mp-label">Were you found at-fault?</label>
                        <div class="mp-radio-group">
                            <label class="mp-radio-item"><input type="radio" name="mp_f314" value="Yes" onchange="mpDep(314,'Yes')"> Yes</label>
                            <label class="mp-radio-item"><input type="radio" name="mp_f314" value="No" onchange="mpDep(314,'No')"> No</label>
                            <label class="mp-radio-item"><input type="radio" name="mp_f314" value="" onchange="mpDep(314,'')" checked> Unknown</label>
                        </div>
                    </div>
                    <div class="mp-col-3">
                        <label class="mp-label">Accident Date <small>(2 Year Statute)</small></label>
                        <input class="mp-input" type="text" value="3/28/2026">
                    </div>
                    <div class="mp-col-3">
                        <label class="mp-label">Legal US Status</label>
                        <div class="mp-radio-group">
                            <label class="mp-radio-item"><input type="radio" name="mp_f315" value="Yes" onchange="mpDep(315,'Yes')" checked> Yes</label>
                            <label class="mp-radio-item"><input type="radio" name="mp_f315" value="No" onchange="mpDep(315,'No')"> No</label>
                            <label class="mp-radio-item"><input type="radio" name="mp_f315" value="" onchange="mpDep(315,'')"> Unknown</label>
                        </div>
                    </div>
                </div>

                <div class="mp-alert-danger mp-hidden" id="mp_d317">No Insurance — Case Not Qualified</div>
                <div class="mp-alert-danger mp-hidden" id="mp_d319">At Fault — Case Not Qualified</div>
                <div class="mp-alert-danger mp-hidden" id="mp_d318">No US Status — Case Not Qualified</div>

                <!-- ════ Accident Details ════ -->
                <div class="mp-section-header">Accident Details</div>

                <div class="mp-form-row">
                    <div class="mp-col-4">
                        <label class="mp-label">Type of MVA</label>
                        <div class="mp-radio-group">
                            <label class="mp-radio-item"><input type="radio" name="mp_f237" value="Auto"> Auto</label>
                            <label class="mp-radio-item"><input type="radio" name="mp_f237" value="Trucking"> Trucking</label>
                        </div>
                    </div>
                    <div class="mp-col-4">
                        <label class="mp-label">Location of Incident (City/State &amp; Specific Area)</label>
                        <input class="mp-input" type="text" value="N. Robinson &amp; Mandeville St.">
                    </div>
                    <div class="mp-col-3">
                        <label class="mp-label">Time (AM/PM)</label>
                        <select class="mp-select">
                            <option value="">--Choose--</option>
                            <option value="AM">AM</option>
                            <option value="PM" selected>PM</option>
                        </select>
                    </div>
                </div>

                <div class="mp-form-row">
                    <div class="mp-col-4">
                        <label class="mp-label">Time of Accident</label>
                        <input class="mp-input" type="text" value="1:15-1:30">
                    </div>
                    <div class="mp-col-4">
                        <label class="mp-label">Weather Conditions</label>
                        <select class="mp-select" onchange="mpDep(346,this.value)">
                            <option value="">--Choose--</option>
                            <option value="Clear / Sunny" selected>Clear / Sunny</option>
                            <option value="Rain (light)">Rain (light)</option>
                            <option value="Rain (Heavy)">Rain (Heavy)</option>
                            <option value="Thunderstorms">Thunderstorms</option>
                            <option value="Snow (light)">Snow (light)</option>
                            <option value="Fog / Mist / Haze / Smoke">Fog / Mist / Haze / Smoke</option>
                            <option value="Hurricane">Hurricane</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div class="mp-col-4 mp-hidden" id="mp_d347">
                        <label class="mp-label">Conditions: Other</label>
                        <input class="mp-input" type="text" placeholder="Describe conditions...">
                    </div>
                </div>

                <div class="mp-form-row">
                    <div class="mp-col-4">
                        <label class="mp-label">Your Role in the Accident</label>
                        <div class="mp-radio-group">
                            <label class="mp-radio-item"><input type="radio" name="mp_f241" value="Driver" onchange="mpDep(241,'Driver')" checked> Driver</label>
                            <label class="mp-radio-item"><input type="radio" name="mp_f241" value="Passenger" onchange="mpDep(241,'Passenger')"> Passenger</label>
                        </div>
                    </div>
                    <div class="mp-col-4" id="mp_d312">
                        <label class="mp-label">Driver via rideshare?</label>
                        <div class="mp-radio-group">
                            <label class="mp-radio-item"><input type="radio" name="mp_f312" value="Yes"> Yes</label>
                            <label class="mp-radio-item"><input type="radio" name="mp_f312" value="No" checked> No</label>
                            <label class="mp-radio-item"><input type="radio" name="mp_f312" value=""> Unknown</label>
                        </div>
                    </div>
                    <div class="mp-col-4 mp-hidden" id="mp_d313">
                        <label class="mp-label">Riding via Rideshare?</label>
                        <select class="mp-select">
                            <option value="">--Choose--</option>
                            <option>No</option><option>Lyft</option><option>Uber</option><option>Other</option>
                        </select>
                    </div>
                </div>

                <div class="mp-form-row">
                    <div class="mp-col-3">
                        <label class="mp-label">Were you in your vehicle at time of accident?</label>
                        <div class="mp-radio-group">
                            <label class="mp-radio-item"><input type="radio" name="mp_f307" value="Yes" onchange="mpDep(307,'Yes')" checked> Yes</label>
                            <label class="mp-radio-item"><input type="radio" name="mp_f307" value="No" onchange="mpDep(307,'No')"> No</label>
                            <label class="mp-radio-item"><input type="radio" name="mp_f307" value="" onchange="mpDep(307,'')"> Unknown</label>
                        </div>
                    </div>
                    <div class="mp-col-4">
                        <label class="mp-label">Other Occupants in the Vehicle?</label>
                        <div class="mp-radio-group">
                            <label class="mp-radio-item"><input type="radio" name="mp_f242" value="Yes" checked> Yes</label>
                            <label class="mp-radio-item"><input type="radio" name="mp_f242" value="No"> No</label>
                            <label class="mp-radio-item"><input type="radio" name="mp_f242" value=""> Unknown</label>
                        </div>
                    </div>
                    <div class="mp-col-4">
                        <label class="mp-label">Names &amp; Contact Information</label>
                        <textarea class="mp-textarea">Trinity Johnson (GF &amp; front passenger)</textarea>
                    </div>
                </div>

                <div class="mp-form-row">
                    <div class="mp-col-4">
                        <label class="mp-label">Witnesses Not Involved in the Collision?</label>
                        <div class="mp-radio-group">
                            <label class="mp-radio-item"><input type="radio" name="mp_f244" value="Yes" onchange="mpDep(244,'Yes')"> Yes</label>
                            <label class="mp-radio-item"><input type="radio" name="mp_f244" value="No" onchange="mpDep(244,'No')"> No</label>
                            <label class="mp-radio-item"><input type="radio" name="mp_f244" value="" onchange="mpDep(244,'')" checked> Unknown</label>
                        </div>
                    </div>
                    <div class="mp-col-4 mp-hidden" id="mp_d245">
                        <label class="mp-label">Witness Names &amp; Contact Info</label>
                        <textarea class="mp-textarea" placeholder="Enter witness details..."></textarea>
                    </div>
                    <div class="mp-col-4">
                        <label class="mp-label">Was this a hit and run?</label>
                        <div class="mp-radio-group">
                            <label class="mp-radio-item"><input type="radio" name="mp_f332" value="Yes" onchange="mpDep(332,'Yes')"> Yes</label>
                            <label class="mp-radio-item"><input type="radio" name="mp_f332" value="No" onchange="mpDep(332,'No')" checked> No</label>
                            <label class="mp-radio-item"><input type="radio" name="mp_f332" value="" onchange="mpDep(332,'')"> Unknown</label>
                        </div>
                    </div>
                </div>

                <div class="mp-form-row mp-hidden" id="mp_d333">
                    <div class="mp-col-6">
                        <label class="mp-label">License Plate Number? <small>If Available</small></label>
                        <textarea class="mp-textarea" placeholder="Enter license plate..."></textarea>
                    </div>
                </div>

                <!-- ════ Injury Details ════ -->
                <div class="mp-section-header">Injury Details</div>

                <div class="mp-form-row">
                    <div class="mp-col-4">
                        <label class="mp-label">Were you wearing your seatbelt?</label>
                        <div class="mp-radio-group">
                            <label class="mp-radio-item"><input type="radio" name="mp_f103" value="Yes"> Yes</label>
                            <label class="mp-radio-item"><input type="radio" name="mp_f103" value="No" checked> No</label>
                            <label class="mp-radio-item"><input type="radio" name="mp_f103" value=""> Unknown</label>
                        </div>
                    </div>
                    <div class="mp-col-4">
                        <label class="mp-label">Were You Injured?</label>
                        <div class="mp-radio-group">
                            <label class="mp-radio-item"><input type="radio" name="mp_f247" value="Yes" onchange="mpDep(247,'Yes')" checked> Yes</label>
                            <label class="mp-radio-item"><input type="radio" name="mp_f247" value="No" onchange="mpDep(247,'No')"> No</label>
                            <label class="mp-radio-item"><input type="radio" name="mp_f247" value="" onchange="mpDep(247,'')"> Unknown</label>
                        </div>
                    </div>
                    <div class="mp-col-4" id="mp_d248">
                        <label class="mp-label">Injuries</label>
                        <textarea class="mp-textarea">lower back, shoulders</textarea>
                    </div>
                </div>

                <div class="mp-form-row">
                    <div class="mp-col-4">
                        <label class="mp-label">Did You Hit Your Head / Experience Head Pain?</label>
                        <div class="mp-radio-group">
                            <label class="mp-radio-item"><input type="radio" name="mp_f249" value="Yes" onchange="mpDep(249,'Yes')"> Yes</label>
                            <label class="mp-radio-item"><input type="radio" name="mp_f249" value="No" onchange="mpDep(249,'No')"> No</label>
                            <label class="mp-radio-item"><input type="radio" name="mp_f249" value="" onchange="mpDep(249,'')" checked> Unknown</label>
                        </div>
                    </div>
                </div>

                <!-- Concussion questionnaire -->
                <div class="mp-hidden" id="mp_d_concussion">
                    <div class="mp-section-header">Concussion Symptom Questionnaire (0 = Not a Problem · 5 = Severe)</div>
                    <div class="mp-concussion-grid" id="mp_concussionGrid"></div>
                </div>

                <div class="mp-form-row" style="margin-top:10px">
                    <div class="mp-col-4">
                        <label class="mp-label">Received Medical Attention?</label>
                        <div class="mp-radio-group">
                            <label class="mp-radio-item"><input type="radio" name="mp_f250" value="Yes" onchange="mpDep(250,'Yes')"> Yes</label>
                            <label class="mp-radio-item"><input type="radio" name="mp_f250" value="No" onchange="mpDep(250,'No')" checked> No</label>
                            <label class="mp-radio-item"><input type="radio" name="mp_f250" value="" onchange="mpDep(250,'')"> Unknown</label>
                        </div>
                    </div>
                    <div class="mp-col-4">
                        <label class="mp-label">Where did you receive medical attention?</label>
                        <div class="mp-check-group">
                            <label class="mp-check-item"><input type="checkbox"> EMS</label>
                            <label class="mp-check-item"><input type="checkbox"> Urgent Care</label>
                            <label class="mp-check-item"><input type="checkbox"> ER</label>
                            <label class="mp-check-item"><input type="checkbox"> Primary Care Physician</label>
                            <label class="mp-check-item"><input type="checkbox"> Treatment Facility</label>
                        </div>
                    </div>
                </div>

                <div class="mp-form-row mp-hidden" id="mp_d252">
                    <div class="mp-col-6">
                        <label class="mp-label">Provider Names, Addresses, Dates of Visits</label>
                        <textarea class="mp-textarea" placeholder="Enter provider details..."></textarea>
                    </div>
                    <div class="mp-col-6">
                        <label class="mp-label">Effect of This Accident on Prior Injuries</label>
                        <textarea class="mp-textarea" placeholder="Describe effects..."></textarea>
                    </div>
                </div>

                <!-- ════ Existing Claims ════ -->
                <div class="mp-section-header">Existing Claims</div>

                <div class="mp-form-row">
                    <div class="mp-col-4">
                        <label class="mp-label">Client Auto Insurance Provider</label>
                        <div class="mp-fv-chip"><span>↗</span> National General Insurance <button>✕</button></div>
                    </div>
                    <div class="mp-col-4">
                        <label class="mp-label">Client Policy Number</label>
                        <textarea class="mp-textarea" rows="1">2032926015</textarea>
                    </div>
                    <div class="mp-col-4">
                        <label class="mp-label">Client Claim Number</label>
                        <textarea class="mp-textarea" rows="1">260368316</textarea>
                    </div>
                </div>

                <div class="mp-form-row">
                    <div class="mp-col-4">
                        <label class="mp-label">At Fault Auto Insurance Provider</label>
                        <div class="mp-fv-chip"><span>↗</span> Geico Insurance <button>✕</button></div>
                    </div>
                    <div class="mp-col-4">
                        <label class="mp-label">At Fault Policy Number</label>
                        <textarea class="mp-textarea" rows="1">4520102882</textarea>
                    </div>
                    <div class="mp-col-4">
                        <label class="mp-label">At Fault Claim Number</label>
                        <textarea class="mp-textarea" rows="1">0614882070101034</textarea>
                    </div>
                </div>

                <div class="mp-form-row">
                    <div class="mp-col-12">
                        <label class="mp-label">At Fault Year, Make, Model</label>
                        <textarea class="mp-textarea" rows="1">Subaru legacy?</textarea>
                    </div>
                </div>

                <div class="mp-form-row">
                    <div class="mp-col-4">
                        <label class="mp-label">Has the Other Party's Insurance Contacted You?</label>
                        <div class="mp-radio-group">
                            <label class="mp-radio-item"><input type="radio" name="mp_f270" value="Yes"> Yes</label>
                            <label class="mp-radio-item"><input type="radio" name="mp_f270" value="No"> No</label>
                            <label class="mp-radio-item"><input type="radio" name="mp_f270" value="" checked> Unknown</label>
                        </div>
                    </div>
                    <div class="mp-col-4">
                        <label class="mp-label">Do You Have Health Insurance?</label>
                        <div class="mp-radio-group">
                            <label class="mp-radio-item"><input type="radio" name="mp_f271" value="Yes" onchange="mpDep(271,'Yes')"> Yes</label>
                            <label class="mp-radio-item"><input type="radio" name="mp_f271" value="No" onchange="mpDep(271,'No')" checked> No</label>
                            <label class="mp-radio-item"><input type="radio" name="mp_f271" value="" onchange="mpDep(271,'')"> Unknown</label>
                        </div>
                    </div>
                    <div class="mp-col-4 mp-hidden" id="mp_d272">
                        <label class="mp-label">Health Insurance Details</label>
                        <input class="mp-input" type="text" placeholder="Enter health insurance details...">
                    </div>
                </div>

                <div class="mp-form-row">
                    <div class="mp-col-4">
                        <label class="mp-label">Medicaid?</label>
                        <div class="mp-radio-group">
                            <label class="mp-radio-item"><input type="radio" name="mp_f40" value="Yes" onchange="mpDep(40,'Yes')" checked> Yes</label>
                            <label class="mp-radio-item"><input type="radio" name="mp_f40" value="No" onchange="mpDep(40,'No')"> No</label>
                            <label class="mp-radio-item"><input type="radio" name="mp_f40" value="" onchange="mpDep(40,'')"> Unknown</label>
                        </div>
                    </div>
                    <div class="mp-col-6" id="mp_d41">
                        <label class="mp-label">Medicaid Insurance</label>
                        <input class="mp-input" type="text" value="America Health">
                    </div>
                </div>

                <div class="mp-form-row">
                    <div class="mp-col-4">
                        <label class="mp-label">Medicare?</label>
                        <div class="mp-radio-group">
                            <label class="mp-radio-item"><input type="radio" name="mp_f42" value="Yes" onchange="mpDep(42,'Yes')"> Yes</label>
                            <label class="mp-radio-item"><input type="radio" name="mp_f42" value="No" onchange="mpDep(42,'No')"> No</label>
                            <label class="mp-radio-item"><input type="radio" name="mp_f42" value="" onchange="mpDep(42,'')" checked> Unknown</label>
                        </div>
                    </div>
                    <div class="mp-col-6 mp-hidden" id="mp_d43">
                        <label class="mp-label">Medicare Insurance</label>
                        <input class="mp-input" type="text" placeholder="Enter Medicare insurance...">
                    </div>
                </div>

                <!-- ════ Evidence ════ -->
                <div class="mp-section-header">Evidence</div>

                <div class="mp-form-row">
                    <div class="mp-col-4">
                        <label class="mp-label">Police Report Issued?</label>
                        <div class="mp-radio-group">
                            <label class="mp-radio-item"><input type="radio" name="mp_f96" value="Yes" onchange="mpDep(96,'Yes')" checked> Yes</label>
                            <label class="mp-radio-item"><input type="radio" name="mp_f96" value="No" onchange="mpDep(96,'No')"> No</label>
                            <label class="mp-radio-item"><input type="radio" name="mp_f96" value="" onchange="mpDep(96,'')"> Unknown</label>
                        </div>
                    </div>
                    <div class="mp-col-4" id="mp_d97">
                        <label class="mp-label">Police Report Item Number</label>
                        <input class="mp-input" type="text" value="C-27719-26">
                    </div>
                    <div class="mp-col-4" id="mp_d98">
                        <label class="mp-label">Which agency wrote the report</label>
                        <select class="mp-select" onchange="mpDep(98,this.value)">
                            <option value="">--Choose--</option>
                            <option value="NOPD" selected>NOPD</option>
                            <option value="JPSO">JPSO</option>
                            <option value="State Police">State Police</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>

                <div class="mp-form-row">
                    <div class="mp-col-6 mp-hidden" id="mp_d343">
                        <label class="mp-label">Reporting Agency Other</label>
                        <input class="mp-input" type="text" placeholder="Enter agency name...">
                    </div>
                    <div class="mp-col-6" id="mp_d258">
                        <label class="mp-label">Condition of Vehicle</label>
                        <textarea class="mp-textarea">Front &amp; rear bumper on the passenger side</textarea>
                    </div>
                </div>

                <div class="mp-form-row">
                    <div class="mp-col-4">
                        <label class="mp-label">Airbags Deploy?</label>
                        <div class="mp-radio-group">
                            <label class="mp-radio-item"><input type="radio" name="mp_f102" value="Yes"> Yes</label>
                            <label class="mp-radio-item"><input type="radio" name="mp_f102" value="No" checked> No</label>
                            <label class="mp-radio-item"><input type="radio" name="mp_f102" value=""> Unknown</label>
                        </div>
                    </div>
                    <div class="mp-col-4">
                        <label class="mp-label">Where were you seated?</label>
                        <select class="mp-select" onchange="mpDep(218,this.value)">
                            <option value="">--Choose--</option>
                            <option value="Driver" selected>Driver</option>
                            <option value="Front Passenger">Front Passenger</option>
                            <option value="Back Passenger (Left Side)">Back Passenger (Left Side)</option>
                            <option value="Back Passenger (Right Side)">Back Passenger (Right Side)</option>
                            <option value="Back Passenger (Middle)">Back Passenger (Middle)</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div class="mp-col-4 mp-hidden" id="mp_d339">
                        <label class="mp-label">Seating Other</label>
                        <textarea class="mp-textarea" placeholder="Describe seating position..."></textarea>
                    </div>
                </div>

                <!-- ════ Client Vehicle Information ════ -->
                <div class="mp-section-header">Client Vehicle Information</div>

                <div class="mp-form-row">
                    <div class="mp-col-4"><label class="mp-label">Year</label><input class="mp-input" type="text" value="2007"></div>
                    <div class="mp-col-4"><label class="mp-label">Make</label><input class="mp-input" type="text" value="Nissan"></div>
                    <div class="mp-col-4"><label class="mp-label">Model</label><input class="mp-input" type="text" value="Altima"></div>
                </div>

                <div class="mp-form-row">
                    <div class="mp-col-4">
                        <label class="mp-label">Was your vehicle towed from the scene?</label>
                        <div class="mp-radio-group">
                            <label class="mp-radio-item"><input type="radio" name="mp_f69" value="Yes" onchange="mpDep(69,'Yes')"> Yes</label>
                            <label class="mp-radio-item"><input type="radio" name="mp_f69" value="No" onchange="mpDep(69,'No')" checked> No</label>
                            <label class="mp-radio-item"><input type="radio" name="mp_f69" value="" onchange="mpDep(69,'')"> Unknown</label>
                        </div>
                    </div>
                    <div class="mp-col-6 mp-hidden" id="mp_d311">
                        <label class="mp-label">Company that towed? <small>Company and where it is located</small></label>
                        <textarea class="mp-textarea" placeholder="Enter tow company details..."></textarea>
                    </div>
                </div>

                <div class="mp-form-row">
                    <div class="mp-col-4">
                        <label class="mp-label">Citations Issued to Any Drivers (Including Client)?</label>
                        <div class="mp-radio-group">
                            <label class="mp-radio-item"><input type="radio" name="mp_f262" value="Yes" onchange="mpDep(262,'Yes')"> Yes</label>
                            <label class="mp-radio-item"><input type="radio" name="mp_f262" value="No" onchange="mpDep(262,'No')"> No</label>
                            <label class="mp-radio-item"><input type="radio" name="mp_f262" value="" onchange="mpDep(262,'')" checked> Unknown</label>
                        </div>
                    </div>
                    <div class="mp-col-6 mp-hidden" id="mp_d263">
                        <label class="mp-label">Citation Details</label>
                        <textarea class="mp-textarea" placeholder="Describe citations issued..."></textarea>
                    </div>
                </div>

                <div class="mp-form-row">
                    <div class="mp-col-4">
                        <label class="mp-label">Consumed alcohol or drugs within 24 hours prior to accident?</label>
                        <div class="mp-radio-group">
                            <label class="mp-radio-item"><input type="radio" name="mp_f58" value="Yes" onchange="mpDep(58,'Yes')"> Yes</label>
                            <label class="mp-radio-item"><input type="radio" name="mp_f58" value="No" onchange="mpDep(58,'No')" checked> No</label>
                            <label class="mp-radio-item"><input type="radio" name="mp_f58" value="" onchange="mpDep(58,'')"> Unknown</label>
                        </div>
                    </div>
                    <div class="mp-col-6 mp-hidden" id="mp_d310">
                        <label class="mp-label">Consumption Details</label>
                        <textarea class="mp-textarea" placeholder="Describe consumption..."></textarea>
                    </div>
                </div>

                <div class="mp-form-row">
                    <div class="mp-col-4">
                        <label class="mp-label">Was there a red light camera or business nearby with footage?</label>
                        <div class="mp-radio-group">
                            <label class="mp-radio-item"><input type="radio" name="mp_f100" value="Yes" onchange="mpDep(100,'Yes')" checked> Yes</label>
                            <label class="mp-radio-item"><input type="radio" name="mp_f100" value="No" onchange="mpDep(100,'No')"> No</label>
                            <label class="mp-radio-item"><input type="radio" name="mp_f100" value="" onchange="mpDep(100,'')"> Unknown</label>
                        </div>
                    </div>
                    <div class="mp-col-6" id="mp_d101">
                        <label class="mp-label">Business and/or location of red light camera</label>
                        <input class="mp-input" type="text" value="RTCC?">
                    </div>
                </div>

                <!-- ════ Additional Info ════ -->
                <div class="mp-section-header">Additional Info</div>

                <div class="mp-form-row">
                    <div class="mp-col-4">
                        <label class="mp-label">Prior Auto Accidents?</label>
                        <div class="mp-radio-group">
                            <label class="mp-radio-item"><input type="radio" name="mp_f275" value="Yes" onchange="mpDep(275,'Yes')" checked> Yes</label>
                            <label class="mp-radio-item"><input type="radio" name="mp_f275" value="No" onchange="mpDep(275,'No')"> No</label>
                            <label class="mp-radio-item"><input type="radio" name="mp_f275" value="" onchange="mpDep(275,'')"> Unknown</label>
                        </div>
                    </div>
                    <div class="mp-col-6" id="mp_d276">
                        <label class="mp-label">Prior Accident Details</label>
                        <input class="mp-input" type="text" value="Represented by AKD">
                    </div>
                </div>

                <div class="mp-form-row">
                    <div class="mp-col-4">
                        <label class="mp-label">Open Claims or Lawsuits?</label>
                        <div class="mp-radio-group">
                            <label class="mp-radio-item"><input type="radio" name="mp_f277" value="Yes" onchange="mpDep(277,'Yes')"> Yes</label>
                            <label class="mp-radio-item"><input type="radio" name="mp_f277" value="No" onchange="mpDep(277,'No')" checked> No</label>
                            <label class="mp-radio-item"><input type="radio" name="mp_f277" value="" onchange="mpDep(277,'')"> Unknown</label>
                        </div>
                    </div>
                    <div class="mp-col-6 mp-hidden" id="mp_d278">
                        <label class="mp-label">Prior Claims Details</label>
                        <input class="mp-input" type="text" placeholder="Enter claims details...">
                    </div>
                </div>

                <div class="mp-form-row">
                    <div class="mp-col-4">
                        <label class="mp-label">Any other prior personal injuries?</label>
                        <div class="mp-radio-group">
                            <label class="mp-radio-item"><input type="radio" name="mp_f329" value="Yes" onchange="mpDep(329,'Yes')"> Yes</label>
                            <label class="mp-radio-item"><input type="radio" name="mp_f329" value="No" onchange="mpDep(329,'No')"> No</label>
                            <label class="mp-radio-item"><input type="radio" name="mp_f329" value="" onchange="mpDep(329,'')" checked> Unknown</label>
                        </div>
                    </div>
                    <div class="mp-col-6 mp-hidden" id="mp_d330">
                        <label class="mp-label">Prior injury details <small>Date, attorney, injuries</small></label>
                        <textarea class="mp-textarea" placeholder="Describe prior injuries..."></textarea>
                    </div>
                </div>

                <div class="mp-form-row">
                    <div class="mp-col-4">
                        <label class="mp-label">Currently Employed?</label>
                        <div class="mp-radio-group">
                            <label class="mp-radio-item"><input type="radio" name="mp_f279" value="Yes" onchange="mpDep(279,'Yes')" checked> Yes</label>
                            <label class="mp-radio-item"><input type="radio" name="mp_f279" value="No" onchange="mpDep(279,'No')"> No</label>
                            <label class="mp-radio-item"><input type="radio" name="mp_f279" value="" onchange="mpDep(279,'')"> Unknown</label>
                        </div>
                    </div>
                    <div class="mp-col-4" id="mp_d334">
                        <label class="mp-label">Occupation?</label>
                        <textarea class="mp-textarea" placeholder="Enter occupation..."></textarea>
                    </div>
                    <div class="mp-col-4" id="mp_d335">
                        <label class="mp-label">Employer?</label>
                        <textarea class="mp-textarea" placeholder="Enter employer..."></textarea>
                    </div>
                </div>

                <div class="mp-form-row" id="mp_d336_row">
                    <div class="mp-col-4" id="mp_d336">
                        <label class="mp-label">Missed work?</label>
                        <div class="mp-radio-group">
                            <label class="mp-radio-item"><input type="radio" name="mp_f336" value="Yes" onchange="mpDep(336,'Yes')" checked> Yes</label>
                            <label class="mp-radio-item"><input type="radio" name="mp_f336" value="No" onchange="mpDep(336,'No')"> No</label>
                            <label class="mp-radio-item"><input type="radio" name="mp_f336" value="" onchange="mpDep(336,'')"> Unknown</label>
                        </div>
                    </div>
                    <div class="mp-col-4" id="mp_d341">
                        <label class="mp-label">How much do you make</label>
                        <textarea class="mp-textarea" placeholder="Enter salary/wage..."></textarea>
                    </div>
                    <div class="mp-col-4" id="mp_d338">
                        <label class="mp-label">How much time have you missed</label>
                        <textarea class="mp-textarea">1day</textarea>
                    </div>
                </div>

                <div class="mp-form-row">
                    <div class="mp-col-12">
                        <label class="mp-label">Other Notes/Documentation to Consider</label>
                        <textarea class="mp-textarea" placeholder="Enter any additional notes..."></textarea>
                    </div>
                </div>

                <!-- ════ Assignment ════ -->
                <div class="mp-section-header">Assignment &amp; Severity</div>

                <div class="mp-form-row">
                    <div class="mp-col-4">
                        <label class="mp-label">Severity Level <span class="mp-req">*</span></label>
                        <select class="mp-select">
                            <option value="">-- Choose Severity Level --</option>
                            <option value="1">1 : No Case</option>
                            <option value="2">2 : Unlikely Case - No Injuries</option>
                            <option value="3" selected>3 : Possible Case - Minor Injuries / Light Therapy</option>
                            <option value="4">4 : Likely Case - Moderate Injuries / Ongoing Treatment</option>
                            <option value="5">5 : Very Likely Case - Severe / Catastrophic</option>
                        </select>
                    </div>
                    <div class="mp-col-4">
                        <label class="mp-label">Office <span class="mp-req">*</span></label>
                        <select class="mp-select">
                            <option value="">-- Choose Office --</option>
                            <option value="1" selected>Cosse Law Firm</option>
                        </select>
                    </div>
                    <div class="mp-col-4">
                        <label class="mp-label">Assigned To Intake <span class="mp-req">*</span></label>
                        <select class="mp-select">
                            <option value="">-- Assign To --</option>
                            <option value="35">Hector Santos</option>
                            <option value="2">Irvy Cosse</option>
                            <option value="33">Isabel Rovinsky</option>
                            <option value="30" selected>Kayla Allemore</option>
                            <option value="32">Kerri James</option>
                        </select>
                    </div>
                </div>

                <div class="mp-form-row">
                    <div class="mp-col-4">
                        <label class="mp-label">Assigned To Attorney</label>
                        <select class="mp-select">
                            <option value="">-- Assign To --</option>
                            <option value="16" selected>Alex Dimitry</option>
                            <option value="25">Howard Weinstock</option>
                            <option value="2">Irvy Cosse</option>
                            <option value="20">Jake Weinstock</option>
                            <option value="29">Jake Townsend</option>
                            <option value="19">Katelyn Donnelly</option>
                            <option value="13">Lance Engolia</option>
                            <option value="9">Vincent Scallan</option>
                        </select>
                    </div>
                    <div class="mp-col-6">
                        <label class="mp-label">Associated Filevine Teams</label>
                        <select class="mp-select" multiple style="height: 90px;">
                            <option value="1431" selected>Alex Dimitry Team</option>
                            <option value="1060">Default Team</option>
                            <option value="1688">Jake Weinstock's Team</option>
                            <option value="1689">Katelyn Donnelly's Team</option>
                            <option value="1583">Lance Engolia Jr.</option>
                            <option value="1465">VPS Teams</option>
                        </select>
                    </div>
                </div>

            </div><!-- end mp-body -->

            <!-- ── Save bar ── -->
            <div class="mp-save-bar">
                <button class="mp-btn-primary">Update &amp; Return to Dashboard</button>
                <button class="mp-btn-white">Update</button>
                <button class="mp-btn-white mp-close-btn-bottom">Cancel</button>
            </div>

        </div><!-- end mp-modal -->
    `;

    document.body.appendChild(overlay);

    // Build concussion questionnaire dynamically
    const symptoms = [
        'Headaches','Dizziness','Nausea/Vomiting','Noise Sensitivity',
        'Sleeping Disturbance','Fatigue','Feeling irritable','Feeling depressed',
        'Personality Changes','Forgetfulness','Blurred Vision','Light sensitivity','Double vision'
    ];
    const grid = overlay.querySelector("#mp_concussionGrid");
    symptoms.forEach((s, i) => {
        const d = document.createElement("div");
        d.className = "mp-concussion-item";
        const lbl = document.createElement("div");
        lbl.className = "mp-clabel";
        lbl.textContent = s;
        d.appendChild(lbl);
        const row = document.createElement("div");
        row.className = "mp-scale-row";
        ["0","1","2","3","4","5"].forEach(v => {
            const wrap = document.createElement("label");
            wrap.className = "mp-scale-radio";
            const inp = document.createElement("input");
            inp.type = "radio";
            inp.name = "mp_conc" + i;
            inp.value = v;
            wrap.appendChild(inp);
            wrap.appendChild(document.createTextNode(v));
            row.appendChild(wrap);
        });
        d.appendChild(row);
        grid.appendChild(d);
    });

    // Close handlers
    overlay.querySelector(".mp-close-btn").addEventListener("click", () => overlay.remove());
    overlay.querySelector(".mp-close-btn-bottom").addEventListener("click", () => overlay.remove());
    overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.remove(); });
}


// ════════════════════════════════════════════════════════
// Dependent field show/hide engine (scoped to mp_ prefix)
// ════════════════════════════════════════════════════════
function mpShow(id) { const e = document.getElementById(id); if (e) e.classList.remove("mp-hidden"); }
function mpHide(id) { const e = document.getElementById(id); if (e) e.classList.add("mp-hidden"); }
function mpToggle(id, visible) { visible ? mpShow(id) : mpHide(id); }

function mpDep(field, val) {
    if (field === 15)  { mpToggle("mp_d16", val === "Yes"); mpHide("mp_d17"); }
    if (field === 16)  { mpToggle("mp_d17", val === "Yes"); }
    if (field === 265) { mpToggle("mp_d317", val === "No"); }
    if (field === 314) { mpToggle("mp_d319", val === "Yes"); }
    if (field === 315) { mpToggle("mp_d318", val === "No"); }
    if (field === 346) { mpToggle("mp_d347", val === "Other"); }
    if (field === 241) { mpToggle("mp_d312", val === "Driver"); mpToggle("mp_d313", val === "Passenger"); }
    if (field === 307) { mpToggle("mp_d258", val === "Yes"); }
    if (field === 244) { mpToggle("mp_d245", val === "Yes"); }
    if (field === 332) { mpToggle("mp_d333", val === "Yes"); }
    if (field === 247) { mpToggle("mp_d248", val === "Yes"); }
    if (field === 249) { mpToggle("mp_d_concussion", val === "Yes"); }
    if (field === 250) { mpToggle("mp_d252", val === "Yes"); }
    if (field === 271) { mpToggle("mp_d272", val === "Yes"); }
    if (field === 40)  { mpToggle("mp_d41", val === "Yes"); }
    if (field === 42)  { mpToggle("mp_d43", val === "Yes"); }
    if (field === 96)  { mpToggle("mp_d97", val === "Yes"); mpToggle("mp_d98", val === "Yes"); }
    if (field === 98)  { mpToggle("mp_d343", val === "Other"); }
    if (field === 218) { mpToggle("mp_d339", val === "Other"); }
    if (field === 69)  { mpToggle("mp_d311", val === "Yes"); }
    if (field === 262) { mpToggle("mp_d263", val === "Yes"); }
    if (field === 58)  { mpToggle("mp_d310", val === "Yes"); }
    if (field === 100) { mpToggle("mp_d101", val === "Yes"); }
    if (field === 275) { mpToggle("mp_d276", val === "Yes"); }
    if (field === 277) { mpToggle("mp_d278", val === "Yes"); }
    if (field === 329) { mpToggle("mp_d330", val === "Yes"); }
    if (field === 279) {
        mpToggle("mp_d334", val === "Yes");
        mpToggle("mp_d335", val === "Yes");
        mpToggle("mp_d336", val === "Yes");
        mpToggle("mp_d336_row", val === "Yes");
    }
    if (field === 336) { mpToggle("mp_d341", val === "Yes"); mpToggle("mp_d338", val === "Yes"); }
}

function mpCaseTypeChange(sel) {
    mpToggle("mp_unrelated", sel.value === "-1");
}


// ════════════════════════════════════════════════════════
// Data fetching (unchanged)
// ════════════════════════════════════════════════════════
function prefetchContact(cId) {
    if (contactCache.has(cId)) return;
    const promise = fetch(
        `https://staging.ghlplugins.com:8088/calendar/appointmentContactName/${cId}`
    )
        .then((response) => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then((result) => {
            if (result && result.message && result.message.contact) {
                return result.message.contact;
            }
            throw new Error(`Contact object does not have a name property`);
        })
        .catch((error) => {
            console.error(`Failed to prefetch contact ${cId}:`, error);
            contactCache.delete(cId);
            return null;
        });
    contactCache.set(cId, promise);
}

async function performRequest(cId, oId) {
    try {
        let contact = contactCache.has(cId) ? await contactCache.get(cId) : null;
        if (!contact) {
            prefetchContact(cId);
            contact = await contactCache.get(cId);
        }
        if (contact) {
            showContactModal(contact);
        }
    } catch (error) {
        console.error(`Failed to fetch contact with id ${cId}:`, error);
    }
}
</script>
<!-- see-->





<!-- hide show elements starts here --> 
<script>
let cardInterval;

window.addEventListener("routeChangeEvent", function (eev) {
    hideInstallmentsForSpecificAccount();
    console.log("Route changed to ketchasso.js");
    console.log(eev);
    if (eev.detail.to.name === "opportunities-list-v2") {
        getInfo();
    } else {
        clearInterval(cardInterval);
    }
});

function hideInstallmentsForSpecificAccount() {

    if (!window.location.href.includes("/v2/location/oUKKuxKyYWHUoncYOKhr")) return;

    function applyLogic() {

        let show = false;

        const thirdParty = [...document.querySelectorAll(".hr-form-item")]
            .find(item =>
                item.querySelector(".hr-form-item-label__text")?.textContent?.trim() === "Third Party Payor?"
            );

        if (thirdParty) {
            const yes = thirdParty.querySelector("input[value='Yes']");
            if (yes && yes.checked) show = true;
        }

        document.querySelectorAll(".hr-form-item").forEach(item => {

            const label = item.querySelector(".hr-form-item-label__text")
                ?.textContent?.trim();

            if (label === "Number of Installments (Contracts)") {
                item.style.setProperty("display", "none", "important");
            }

            if (
                label === "3rd Party Payor Name" ||
                label === "Third Party Payor Email" ||
                label === "Third Party Payer Phone"
            ) {
                item.style.setProperty(
                    "display",
                    show ? "" : "none",
                    "important"
                );
            }
        });
    }

    // wait for radios
    const wait = setInterval(() => {
        const radios = document.querySelectorAll("input.hr-radio-input");

        if (radios.length) {
            clearInterval(wait);

            applyLogic();

            radios.forEach(radio => {
                radio.addEventListener("change", () => {
                    setTimeout(applyLogic, 50);
                });
            });
        }
    }, 300);
}

function getInfo() {
    cardInterval = setInterval(() => {
        let cards = document.querySelectorAll(".ui-card .ui-card-content [data-contact-id]");
        if (cards.length > 0) {
            cards.forEach(element => {
                let parentDiv = element.parentElement;

                if (!parentDiv.querySelector(".parker_script")) {
                    parentDiv.classList.add("parker_script");
                    parentDiv.addEventListener("click", () => {
                        AddClick();
                    });
                }
            });
        }
    }, 500);
}
  
function AddClick() {
    const tabInterval = setInterval(() => {
        let container = document.querySelector(".innerWrapper .wrapperHeader");

        if (container) {
            let tabs = document.querySelectorAll(".innerWrapper .wrapperHeader button");
            if (tabs.length > 0) {
                tabs.forEach(tab => {
                    if (tab.textContent.includes("Agreement")) {
                        tab.addEventListener("click", () => {
                            HideCustomfields();
                        });
                    }
                });
            }
        }
    }, 500);
}

function HideCustomfields() {
    hideInstallmentsForSpecificAccount();
    let lastContactType = null;
    let lastFeeType = null;
    let lastReferralType = null;

    const checkInterval = setInterval(() => {

        const tabActive =
            document.querySelector('.wrapperHeader button.bg-blue-50')
                ?.textContent?.trim() === "Agreement Setup";
        if (!tabActive) return;

        const singleSelects = document.querySelectorAll('div[test-data-type="SINGLE_OPTIONS"]');

        const contactTypeDisplay = singleSelects[0]?.querySelector(
            '.hr-base-selection-input__content, .n-base-selection-label, .hr-base-selection-label'
        );

        const feeTypeDisplay = singleSelects.length >= 2
            ? singleSelects[1].querySelector(
                '.hr-base-selection-input__content, .n-base-selection-label, .hr-base-selection-label, .hr-base-selection-placeholder__inner'
              )
            : null;

        if (!contactTypeDisplay || !feeTypeDisplay) return;

        clearInterval(checkInterval);

        const formItems = document.querySelectorAll('.hr-form-item');

        let minorNameField = null;
        let deceasedNameField = null;
        let authorizedRepField = null;
        let parentGuardianFields = [];
        let recoveryPercentFields = [];

        let adultMVAField = null;
        let minorBasicFullField = null;
        let minorMVAField = null;
        let deceasedMVAField = null;

        formItems.forEach(item => {
            const labelEl = item.querySelector('.hr-form-item-label__text, .n-form-item-label__text');
            if (!labelEl) return;

            const labelText = labelEl.textContent.trim();

            if (labelText === "Minor’s Name") {
                minorNameField = item;
            } else if (labelText === "Deceased Name") {
                deceasedNameField = item;
            } else if (labelText === "Authorized Representative") {
                authorizedRepField = item;
            } else if (labelText === "Parent/Guardian’s Name") {
                parentGuardianFields.push(item);
            } else if (labelText.includes("Client will pay _______ of any recovery")) {
                recoveryPercentFields.push(item);
            } else if (labelText === "MVA/NonMVA (Adult)") {
                adultMVAField = item;
            } else if (labelText === "Basic/Full (Minor)") {
                minorBasicFullField = item;
            } else if (labelText === "MVA/NonMVA (Minor)") {
                minorMVAField = item;
            } else if (labelText === "MVA/NonMVA (Deceased)") {
                deceasedMVAField = item;
            }
        });

        [
            minorNameField,
            deceasedNameField,
            authorizedRepField,
            ...parentGuardianFields,
            ...recoveryPercentFields,
            adultMVAField,
            minorBasicFullField,
            minorMVAField,
            deceasedMVAField
        ].forEach(field => field && (field.style.display = 'none'));

        /* ---------------- CONTACT TYPE ---------------- */

        const contactObserver = new MutationObserver(() => {
            const selectedContact = (contactTypeDisplay.textContent || '').trim();
            if (selectedContact === lastContactType) return;
            lastContactType = selectedContact;

            if (minorNameField) minorNameField.style.display = 'none';
            if (deceasedNameField) deceasedNameField.style.display = 'none';
            if (authorizedRepField) authorizedRepField.style.display = 'none';

            parentGuardianFields.forEach(f => f && (f.style.display = 'none'));

            if (adultMVAField) adultMVAField.style.display = 'none';
            if (minorBasicFullField) minorBasicFullField.style.display = 'none';
            if (minorMVAField) minorMVAField.style.display = 'none';
            if (deceasedMVAField) deceasedMVAField.style.display = 'none';

            if (selectedContact === "Adult") {
                if (adultMVAField) adultMVAField.style.display = '';
            }

            if (selectedContact === "Minor") {
                if (minorNameField) minorNameField.style.display = '';
                parentGuardianFields.forEach(f => f && (f.style.display = ''));
                if (minorBasicFullField) minorBasicFullField.style.display = '';
                if (minorMVAField) minorMVAField.style.display = '';
            }

            if (selectedContact === "Deceased") {
                if (deceasedNameField) deceasedNameField.style.display = '';
                if (authorizedRepField) authorizedRepField.style.display = '';
                if (deceasedMVAField) deceasedMVAField.style.display = '';
            }
        });

        contactObserver.observe(contactTypeDisplay, {
            childList: true,
            subtree: true,
            characterData: true,
            attributes: true
        });

        /* ---------------- FEE TYPE ---------------- */

        const feeObserver = new MutationObserver(() => {
            const selectedFee = (feeTypeDisplay.textContent || '').trim().toLowerCase();
            if (selectedFee === lastFeeType) return;
            lastFeeType = selectedFee;

            recoveryPercentFields.forEach(field => field && (field.style.display = 'none'));

            if (
                selectedFee.includes('blank') ||
                selectedFee.includes('contingency') ||
                (!selectedFee.includes('mva') &&
                 !selectedFee.includes('non mva') &&
                 !selectedFee.includes('non-mva') &&
                 !selectedFee.includes('trucking'))
            ) {
                recoveryPercentFields.forEach(field => field && (field.style.display = ''));
            }
        });

        feeObserver.observe(feeTypeDisplay, {
            childList: true,
            subtree: true,
            characterData: true,
            attributes: true
        });

        /* ---------------- REFERRAL TYPE ---------------- */

        let referralFormItem = null;
        let attorneyField = null;

        formItems.forEach(item => {
            const labelEl = item.querySelector('.hr-form-item-label__text, .n-form-item-label__text');
            if (!labelEl) return;

            const labelText = labelEl.textContent.trim();
            if (labelText === "Referral Type") referralFormItem = item;
            if (labelText === "Attorney") attorneyField = item;
        });

        if (referralFormItem && attorneyField) {
            attorneyField.style.display = 'none';

            const evaluateReferral = () => {
                const displayEl = referralFormItem.querySelector(
                    '.hr-base-selection-input__content, .n-base-selection-label'
                );

                const selectedReferral = (displayEl?.textContent || '').trim();
                if (selectedReferral === lastReferralType) return;
                lastReferralType = selectedReferral;

                attorneyField.style.display =
                    selectedReferral === "Referral" ? '' : 'none';
            };

            const referralObserver = new MutationObserver(evaluateReferral);
            referralObserver.observe(referralFormItem, {
                childList: true,
                subtree: true,
                characterData: true
            });

            evaluateReferral();
        }

    }, 400);

    setTimeout(() => clearInterval(checkInterval), 25000);
}
</script>

<!-- hide show elements ends here -->



<script>
    (() => {
        const s = document.createElement('script');
        s.src = 'https://cdn.chatwidgets.net/widget/unified-script-prod/support-os-unified-script.js?t=' + Date.now();
        s.id = 'support-os-unified-script';
        s.dataset.env = 'https://graph.mycrmsupport.net';
        s.dataset.account = 'aBOuoeGk8c6v_N9k';
        document.body.appendChild(s);
    })();
</script>

<!-- Task Menu Solution -->
<!-- <script>https://pimp-my-ghl.s3.amazonaws.com/our-scripts/task_single_menu_v1.5.js</script> old script -->
<script>
    (function () {
        const task_link = document.createElement("a");
        task_link.className = `w-full group px-3 flex items-center justify-center md:justify-center lg:justify-start xl:justify-start text-sm font-medium rounded-md cursor-pointer font-medium opacity-70 hover:opacity-100 py-2 md:py-2`;
        task_link.id = "CustomTask";
        task_link.innerHTML = `
            <span class="h-5 w-5 mr-2"><i class="fas fa-tasks"></i></span>
            <span class="hl_text-overflow hidden md:hidden nav-title lg:block xl:block"> Tasks </span>
        `;

        function navigateTo(path) {
            const app = document.querySelector("#app");
            if (!app) {
                window.location.href = path;
                return;
            }

            // Vue 2 style
            if (app.__vue__ && app.__vue__.$router) {
                app.__vue__.$router.push(path);
                return;
            }

            // Vue 3 style
            if (app.__vue_app__ && app.__vue_app__.config.globalProperties.$router) {
                app.__vue_app__.config.globalProperties.$router.push(path);
                return;
            }

            // fallback
            console.warn("Vue router not found => redirecting via window.location");
            window.location.href = path;
        }

        task_link.addEventListener("click", (e) => {
            e.preventDefault();
            const taskPath = `/v2/location/${task_link.locationId}/tasks`;
            navigateTo(taskPath);
        });

        const getElementByFn = (selector) => {
            return new Promise((resolve) => {
                const interval = setInterval(() => {
                    const elements = document.querySelectorAll(selector);
                    if (elements.length === 1) {
                        clearInterval(interval);
                        resolve(elements[0]);
                    }
                    if (elements.length > 1) {
                        clearInterval(interval);
                        resolve(elements);
                    }
                }, 500);
            });
        };

        window.addEventListener("routeChangeEvent", async (e) => {
            const locationId = e.detail.to.params["location_id"];
            task_link.locationId = locationId;
            if (task_link.isConnected) return;
            if (!locationId) return;

            const dashboard = await getElementByFn("#sb_dashboard");
            dashboard.after(task_link);
        });
    })();
</script>
<!-- End Task Menu Solution -->

<!-- Custom Favicon -->
<script>
    favicon = "https://storage.googleapis.com/msgsndr/bMcj9i4SkZR2VPFrWAk4/media/644009a797b148b2b2fcf2e1.png";
    document.querySelector("link[rel=icon]").href = favicon;
</script>
<!-- End Custom Favicon -->

<!-- Custom Launch Pad Icon -->
<script src="https://pimp-my-ghl.s3.us-west-2.amazonaws.com/our-scripts/old-sidebar-launchpad-icon.js"></script>
<!-- End Custom Launch Pad Icon -->

<!-- PMG Notifications-->
<script src="https://pimp-my-ghl.s3.amazonaws.com/our-scripts/addNotificatoins.js"></script>
<!-- End PMG Notifications-->


<!-- Start of Custom Menu Top position -->
<script type="text/javascript">
    !(function () {
        //const testlocationids = ["XG06UfQ0PKuqMy6v4ucE", "ckIPCeviiuOD8YxTxe3F"]
        const menuNames = ["Get Started", "Start Here"]
        const menuNameSmall = menuNames.map((m) => m.toLowerCase())
        let previousLocationID = ""
        let pageVisited = false

        const getElementByFn = async (selector) => {
            let intervalId
            return new Promise((resolve) => {
                clearInterval(intervalId)
                intervalId = setInterval(() => {
                    const elements = [...document.querySelectorAll(selector)]
                    if (!elements.length) return
                    clearInterval(intervalId)
                    if (elements.length === 1) resolve(elements[0])
                    if (elements.length > 1) resolve(elements)
                }, 300)

                setTimeout(() => {
                    clearInterval(intervalId)
                }, 15000)
            })
        }

        const setTopMenus = async (route) => {
            const navLinks = (await getElementByFn("#sidebar-v2 nav a")) || []
            const selectedMenus = navLinks.filter((link) => {
                // menuNameSmall.includes(link.innerText.trim().toLowerCase())
                return menuNameSmall.some((menu) =>
                    link.innerText.trim().toLowerCase().includes(menu)
                )
            })

            if (selectedMenus.length === 0) return

            selectedMenus.forEach((menu) => {
                if (menu.addedTop) return
                menu.addedTop = true

                if (!pageVisited && route.name === "dashboard-v2")
                    selectedMenus[selectedMenus.length - 1].click()

                pageVisited = true
                getElementByFn("#sb_dashboard").then((dashboard) => {
                    const nav = dashboard.parentElement
                    nav.prepend(menu)
                })
            })
        }

        window.addEventListener("routeChangeEvent", (e) => {
            const isActiveSetting = e.detail.to.fullPath.includes("settings")
            if (isActiveSetting) return (previousLocationID = "")
            const currentLocationId = e.detail.to.params["location_id"]
            const isLocationChange = previousLocationID !== currentLocationId
            previousLocationID = currentLocationId
            if (!isLocationChange) return
            //if (testlocationids.includes(currentLocationId)) setTopMenus(e.detail.to);
            // if (e.detail.to.name === "contact_detail-v2") return 0
            // if (e.detail.to.name === "page-builder-edit") return 0

            setTopMenus(e.detail.to)
        })
    })()
</script>
<!-- End of Custom Menu Top position -->



<script>
    let observer = null;
    let stateOfClaimDropdownOberserver = null;
    let caseTypeDropdowmObserver = null;
    let dropdownParentObserver = null;
    let stateOfClaimDropdownSelectedValue = "";
    let opportunityTabObserver = null;
    let leadAndPdfBtnObserver = null;
    let isRunned = false;
    let isOnboardLocationChecked = false
    let isNewLocationOnboard = false
    let previousLocationId = ""

    window.addEventListener("routeChangeEvent", async function (e) {
        console.log("routeChangeEvent")
        try {
            observer.disconnect();
            stateOfClaimDropdownOberserver.disconnect();
            caseTypeDropdowmObserver.disconnect();
            dropdownParentObserver.disconnect();
            observer = null;
            stateOfClaimDropdownOberserver = null;
            caseTypeDropdowmObserver = null;
            dropdownParentObserver = null;
            opportunityTabObserver = null
            leadAndPdfBtnObserver = null
        } catch (error) { }
        isRunned = false;
        observerFn()
        observerOpportunityTabFn()
        leadAndPdfButtonsObserverFn()


        if (window.location.href.includes("/opportunities/list/")) {
            let locationId = getLocationId()
            // if (previousLocationId !== locationId) {
            //     isOnboardLocationChecked = false
            //     isNewLocationOnboard = false
            //     previousLocationId = locationId
            // }
            let urlParams = new URLSearchParams(window.location.search)
            let opportunityTab = urlParams.get("tab")
            if (opportunityTab) {
                insertIntakeReportBtn()
            }
        }
    });

    observerOpportunityTabFn()
    leadAndPdfButtonsObserverFn()
    let urlParams = new URLSearchParams(window.location.search)
    let opportunityTab = urlParams.get("tab")
    if (opportunityTab) {
        waitForElm(".ui-modal-heading .title").then((iframeElem) => {
            insertIntakeReportBtn()
        });
    }

    function observerFn() {
        if (window.location.href.includes("/v2/location/aSuf3rcTIp7BJMAJOwbY/opportunities/list")) {
            const config = {
                childList: true,
                subtree: true
            };

            const callback = function () {
                function onClickHandler() {
                    document.querySelector("#opportunitiesCustomFieldForm > div").style.cssText = "display: flex; flex-direction: column;"
                    document.querySelectorAll("#opportunitiesCustomFieldForm > div > div:not(#opportunitiesCustomFieldForm > div > div:first-of-type)")?.forEach((dropDownContainer) => {
                        if (!dropDownContainer.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content") && !dropDownContainer.innerText.includes("Referral Notes")) {
                            dropDownContainer.style.display = "none";
                        }
                    });

                    stateOfClaimDropdownOberserver = new MutationObserver((mutationList) => {
                        if (mutationList[0]?.target.innerText !== "") {
                            document.querySelectorAll("#opportunitiesCustomFieldForm > div > div:not(#opportunitiesCustomFieldForm > div > div:first-of-type)")?.forEach((stateOfClaimDropdownContainer, idx) => {
                                stateOfClaimDropdownSelectedValue = mutationList[0]?.target.innerText;

                                if (idx === 0) {
                                    setTimeout(function () {
                                        document.querySelectorAll("#opportunitiesCustomFieldForm > div > div:not(#opportunitiesCustomFieldForm > div > div:first-of-type)")?.forEach((dropdownToClear) => {
                                            dropdownToClear.querySelector(".n-base-clear__placeholder, .hr-base-clear__placeholder").click();
                                        });
                                    }, 0);

                                    setTimeout(function () {
                                        document.querySelectorAll("#opportunitiesCustomFieldForm > div > div:not(#opportunitiesCustomFieldForm > div > div:first-of-type)")?.forEach((dropdownToClear) => {
                                            dropdownToClear.querySelector(".n-base-clear__clear, .hr-base-clear__clear")?.click();
                                        });
                                    }, 0);
                                }


                                if (stateOfClaimDropdownContainer.querySelector(".n-form-item-label__text, .hr-form-item-label__text")?.innerText.includes(stateOfClaimDropdownSelectedValue + "-Case Type")) {
                                    stateOfClaimDropdownContainer.style.display = "block";
                                }
                                else if (!stateOfClaimDropdownContainer.innerText.includes("Referral Notes")) {
                                    stateOfClaimDropdownContainer.style.display = "none";
                                }
                            });
                        }
                    });
                    stateOfClaimDropdownOberserver.observe(document.querySelector("#sIyAw9v4eKWnHF3EecWO .n-base-selection-label, #sIyAw9v4eKWnHF3EecWO .hr-base-selection-label"), config);

                    dropdownParentObserver = new MutationObserver((parentMutaionList) => {
                        let dropdownContainers = document.querySelectorAll("#opportunitiesCustomFieldForm > div > div:not(#opportunitiesCustomFieldForm > div > div:first-of-type)");

                        caseTypeDropdowmObserver = new MutationObserver((mutationList) => {
                            if (mutationList[0]?.target.innerText !== "" && parentMutaionList[0]?.target.innerText !== "") {
                                let caseTypeDropdownSelectedValue = mutationList[0]?.target.innerText;

                                let firmsContainer = [];
                                dropdownContainers.forEach((elem) => {
                                    if (elem.querySelector(".n-form-item-label__text, .hr-form-item-label__text")?.innerText.includes("-Firms")) {
                                        firmsContainer.push(elem);
                                    }
                                });

                                firmsContainer.forEach((container, idx) => {
                                    if (idx === 0) {
                                        setTimeout(function () {
                                            firmsContainer.forEach((dropdownToClear) => {
                                                dropdownToClear.querySelector(".n-base-clear__placeholder, .hr-base-clear__placeholder").click();
                                            });
                                        }, 0);

                                        setTimeout(function () {
                                            firmsContainer.forEach((dropdownToClear) => {
                                                dropdownToClear.querySelector(".n-base-clear__clear, .hr-base-clear__clear")?.click();
                                            });
                                        }, 0);
                                    }
                                    if (container.querySelector(".n-form-item-label__text, .hr-form-item-label__text")?.innerText.includes(document.querySelector("#opportunitiesCustomFieldForm > div > div:first-of-type .n-base-selection-input__content, #opportunitiesCustomFieldForm > div > div:first-of-type .hr-base-selection-input__content")?.innerText + "-" + caseTypeDropdownSelectedValue + "-Firms")) {
                                        container.style.display = "block";
                                    }
                                    else if (!container.innerText.includes("Referral Notes")) {
                                        container.style.display = "none";
                                    }
                                })
                            }
                        });

                        for (let i = 0; i < dropdownContainers.length; i++) {
                            if (dropdownContainers[i].querySelector(".n-form-item-label__text, .hr-form-item-label__text")?.innerText.includes("-Case Type") && (dropdownContainers[i].style.display === "block" || dropdownContainers[i].style.display === "")) {
                                caseTypeDropdowmObserver.observe(dropdownContainers[i].querySelector(".n-base-selection-label, .hr-base-selection-label"), config);
                                break;
                            }
                        }
                    });
                    dropdownParentObserver.observe(document.querySelector("#opportunitiesCustomFieldForm > div"), config);
                }

                document.querySelectorAll(".wrapperHeader button")?.forEach((button) => {
                    if (button.innerText === "Referral Tab" && button.classList.contains("bg-blue-50") && !isRunned) {
                        onClickHandler();
                        isRunned = true;
                    }
                    else if (button.innerText === "Referral Tab") {
                        button.onclick = onClickHandler;
                    }
                })

                let urlParams = new URLSearchParams(window.location.search)
                let opportunityTab = urlParams.get("tab")
                let ageGroup = document.querySelector("#zwNJqQn745DeyXEUSArJ")
                if (ageGroup) {
                    let injuryPartyName = document.querySelector("#iYM9ms7RXPJQ8uf3hBhI")
                    if (ageGroup && injuryPartyName && ageGroup?.textContent === "Minor") {
                        injuryPartyName.closest(".n-form-item").style.display = "block"
                    } else if (injuryPartyName) {
                        injuryPartyName.closest(".n-form-item").style.display = "none"
                    }

                    let radioButtons = document.querySelectorAll("input[type=radio]")
                    let selectAttorneyField = document.querySelector("#qsxRG0vFNJvOBDRO8TGh")
                    let radioEventListenerAdded = document.querySelector(".radioEventListenerAdded")

                    if (!radioEventListenerAdded) {
                        radioButtons.forEach((input) => {
                            input.classList.add("radioEventListenerAdded")
                            let attorneyElement = input.closest(".n-form-item")
                            if (attorneyElement && attorneyElement?.textContent.includes("Did the prospect speak to an attorney")) {
                                if (input.value === "Yes") {
                                    selectAttorneyField.closest(".n-form-item").style.display = "block"
                                } else if (selectAttorneyField) {
                                    selectAttorneyField.closest(".n-form-item").style.display = "none"
                                }
                            }
                            input.addEventListener("input", (e) => {
                                let attorneyElement = e.target.closest(".n-form-item")
                                if (attorneyElement && attorneyElement?.textContent.includes("Did the prospect speak to an attorney")) {
                                    if (e.target.value === "Yes") {
                                        selectAttorneyField.closest(".n-form-item").style.display = "block"
                                    } else {
                                        selectAttorneyField.closest(".n-form-item").style.display = "none"
                                    }
                                }
                            })
                        })
                    }
                }

            };

            observer = new MutationObserver(callback);
            observer.observe(document.body, config);
        }
        if (window.location.href.includes("/v2/location/Fyky8rCoWF7PbWXBa9ok/opportunities/list")) {
            const config = {
                childList: true,
                subtree: true
            };

            let statusDropdownObserver = null;
            let reasonDropdownObserver = null;
            let statusTypeDropdownSelectedValue = "";
            let lostReasonDropdownObserver = null;
            let caseEvaluationeDropdownObserver = null;
            let reasonRejectionDropdownObserver = null;
            let typeOfProviderDropdownObserver = null;
            let natureOfErrorDropdownObserver = null;

            const callback = function () {
                let status = document.querySelector("#OpportunityStatus");
                let divs = document.querySelectorAll('#opportunitiesForm > div > div');
                let internalReview = divs[divs.length - 2];
                let notes = divs[divs.length - 3];
                let reason = divs[divs.length - 4];
                let lostReasonNotes = divs[divs.length - 6];
                let lostReason = document.querySelector("#select-id");
                let caseEvaluationDropdown = document.querySelector("#LRaDJT8y3qQKuFzvPwuI");
                let reasonRejectionDiv = document.querySelector("#opportunitiesCustomFieldForm > div > div:nth-last-of-type(2)");
                let RejectionNotesdiv = document.querySelector("#opportunitiesCustomFieldForm > div > div:nth-last-of-type(1)");
                let reasonRejectionDropdown = document.querySelector("#AgDMGPmgfDhI6KTT3npO");
                let typeOfProviderDropdown = document.querySelector("#XUqr3EwTJpv69ZpA0J3d");
                let natureOfErrorDropdown = document.querySelector("#OTeAQLjrgjQpBvfwGt7S");
                let typeOfProviderDiv = document.querySelector("#opportunitiesCustomFieldForm > div > div:nth-of-type(7)");
                let natureOfErrorDiv = document.querySelector("#opportunitiesCustomFieldForm > div > div:nth-of-type(5)");

             //opportunity here

                function onClickHandler() {
                    document.querySelector("#opportunitiesCustomFieldForm > div").style.cssText = "display: flex; flex-direction: column;"
                    document.querySelectorAll("#opportunitiesCustomFieldForm > div > div:is(:nth-of-type(2), :nth-of-type(3), :nth-of-type(4), :nth-of-type(5))")?.forEach((dropDownContainer) => {
                        if (!dropDownContainer.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")) {
                            dropDownContainer.style.display = "none";
                        }
                    });

                    if (caseEvaluationDropdown && caseEvaluationDropdown.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")?.innerText.includes("Decline")) {
                        reasonRejectionDiv.style.display = "block";
                    }
                    else {
                        reasonRejectionDiv.style.display = "none";
                    }

                    if (reasonRejectionDiv && reasonRejectionDiv.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")?.innerText.includes("Other (note below)")) {
                        RejectionNotesdiv.style.display = "block";
                    }
                    else {
                        RejectionNotesdiv.style.display = "none";
                    }

                    caseEvaluationeDropdownObserver = new MutationObserver((mutationList) => {
                        if (mutationList[0]?.target.innerText !== "") {
                            setTimeout(function () {
                                reasonRejectionDropdown.querySelector(".n-base-clear__placeholder, .hr-base-clear__placeholder").click();
                            }, 0);

                            setTimeout(function () {
                                reasonRejectionDropdown.querySelector(".n-base-clear__clear, .hr-base-clear__clear")?.click();
                            }, 0);

                            if (caseEvaluationDropdown.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")?.innerText.includes("Decline")) {
                                reasonRejectionDiv.style.display = "block";
                            }
                            else {
                                reasonRejectionDiv.style.display = "none";
                                RejectionNotesdiv.style.display = "none";
                            }
                        }
                    });
                    caseEvaluationeDropdownObserver.observe(document.querySelector("#LRaDJT8y3qQKuFzvPwuI .n-base-selection-label, #LRaDJT8y3qQKuFzvPwuI .hr-base-selection-label"), config);

                    reasonRejectionDropdownObserver = new MutationObserver((mutationList) => {
                        if (mutationList[0]?.target.innerText !== "") {
                            if (reasonRejectionDropdown.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")?.innerText.includes("Other (note below)")) {
                                RejectionNotesdiv.style.display = "block";
                            }
                            else {
                                RejectionNotesdiv.style.display = "none";
                            }
                        }
                    });
                    reasonRejectionDropdownObserver.observe(document.querySelector("#AgDMGPmgfDhI6KTT3npO .n-base-selection-label, #AgDMGPmgfDhI6KTT3npO .hr-base-selection-label"), config);

                    caseTypeDropdowmObserver = new MutationObserver((mutationList) => {
                        if (mutationList[0]?.target.innerText !== "") {
                            document.querySelectorAll("#opportunitiesCustomFieldForm > div > div:is(:nth-of-type(2), :nth-of-type(3), :nth-of-type(4), :nth-of-type(5))")?.forEach((caseTypeDropdownContainer, idx) => {
                                caseTypeDropdownSelectedValue = mutationList[0]?.target.innerText;

                                if (idx === 0) {
                                    setTimeout(function () {
                                        document.querySelectorAll("#opportunitiesCustomFieldForm > div > div:is(:nth-of-type(2), :nth-of-type(3), :nth-of-type(4), :nth-of-type(5))")?.forEach((dropdownToClear) => {
                                            dropdownToClear.querySelector(".n-base-clear__placeholder, .hr-base-clear__placeholder").click();
                                        });
                                    }, 0);

                                    setTimeout(function () {
                                        document.querySelectorAll("#opportunitiesCustomFieldForm > div > div:is(:nth-of-type(2), :nth-of-type(3), :nth-of-type(4), :nth-of-type(5))")?.forEach((dropdownToClear) => {
                                            dropdownToClear.querySelector(".n-base-clear__clear, .hr-base-clear__clear")?.click();
                                        });
                                    }, 0);
                                }


                                if (caseTypeDropdownContainer.querySelector(".n-form-item-label__text, .hr-form-item-label__text")?.innerText.includes(caseTypeDropdownSelectedValue + " - Case Type")) {
                                    caseTypeDropdownContainer.style.display = "block";
                                }
                                else {
                                    caseTypeDropdownContainer.style.display = "none";
                                }
                            });
                        }
                    });
                    caseTypeDropdowmObserver.observe(document.querySelector("#pOnW0nIKGWHC5A6aDsQG .n-base-selection-label, #pOnW0nIKGWHC5A6aDsQG .hr-base-selection-label"), config);
                }

                function medMalScreeningClickHandler() {
                    if (typeOfProviderDropdown && typeOfProviderDropdown.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")?.innerText.includes("Other")) {
                        typeOfProviderDiv.style.display = "block";
                    }
                    else {
                        typeOfProviderDiv.style.display = "none";
                    }

                    if (natureOfErrorDropdown && natureOfErrorDropdown.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")?.innerText.includes("Other")) {
                        natureOfErrorDiv.style.display = "block";
                    }
                    else {
                        natureOfErrorDiv.style.display = "none";
                    }

                    typeOfProviderDropdownObserver = new MutationObserver((mutationList) => {
                        if (mutationList[0]?.target.innerText !== "") {
                            if (typeOfProviderDropdown.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")?.innerText.includes("Other")) {
                                typeOfProviderDiv.style.display = "block";
                            }
                            else {
                                typeOfProviderDiv.style.display = "none";
                            }
                        }
                    });
                    typeOfProviderDropdownObserver.observe(document.querySelector("#XUqr3EwTJpv69ZpA0J3d .n-base-selection-label, #XUqr3EwTJpv69ZpA0J3d .hr-base-selection-label"), config);

                    natureOfErrorDropdownObserver = new MutationObserver((mutationList) => {
                        if (mutationList[0]?.target.innerText !== "") {
                            if (natureOfErrorDropdown.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")?.innerText.includes("Other")) {
                                natureOfErrorDiv.style.display = "block";
                            }
                            else {
                                natureOfErrorDiv.style.display = "none";
                            }
                        }
                    });
                    natureOfErrorDropdownObserver.observe(document.querySelector("#OTeAQLjrgjQpBvfwGt7S .n-base-selection-label, #OTeAQLjrgjQpBvfwGt7S .hr-base-selection-label"), config);
                }

                document.querySelectorAll(".wrapperHeader button")?.forEach((button) => {
                    if (button.innerText === "Intake Screening" && button.classList.contains("bg-blue-50") && !isRunned) {
                        onClickHandler();
                        isRunned = true;
                    }
                    else if (button.innerText === "Intake Screening") {
                        button.onclick = onClickHandler;
                    }
                })

                document.querySelectorAll(".wrapperHeader button")?.forEach((button) => {
                    if (button.innerText === "Opportunity Details" && button.classList.contains("bg-blue-50") && !isRunned) {
                        opportunityDetailsClickHandler();
                        isRunned = true;
                    }
                    else if (button.innerText === "Opportunity Details") {
                        button.onclick = opportunityDetailsClickHandler;
                    }
                });

                document.querySelectorAll(".wrapperHeader button")?.forEach((button) => {
                    if (button.innerText === "Med Mal Screening" && button.classList.contains("bg-blue-50") && !isRunned) {
                        medMalScreeningClickHandler();
                        isRunned = true;
                    }
                    else if (button.innerText === "Med Mal Screening") {
                        button.onclick = medMalScreeningClickHandler;
                    }
                });
            }

            observer = new MutationObserver(callback);
            observer.observe(document.body, config);
        }
        else if (window.location.href.includes("/v2/location/0zJVetxLKWFBgyWKbWEm/opportunities/list")) {
            const config = {
                childList: true,
                subtree: true
            };

            let statusDropdownObserver = null;
            let reasonDropdownObserver = null;
            let statusTypeDropdownSelectedValue = "";
            let lostReasonDropdownObserver = null;
            let caseEvaluationeDropdownObserver = null;
            let reasonRejectionDropdownObserver = null;

            const callback = function () {
                let status = document.querySelector("#OpportunityStatus");
                let divs = document.querySelectorAll('#opportunitiesForm > div > div');
                let internalReview = divs[divs.length - 1];
                let notes = divs[divs.length - 2];
                let reason = divs[divs.length - 3];
                let lostReasonNotes = divs[divs.length - 4];
                let lostReason = document.querySelector("#select-id");
                let caseEvaluationDropdown = document.querySelector("#\\33 vc5mZXgcA3mZ0upU2Jv");
                let reasonRejectionDiv = document.querySelector("#opportunitiesCustomFieldForm > div > div:nth-last-of-type(2)");
                let RejectionNotesdiv = document.querySelector("#opportunitiesCustomFieldForm > div > div:nth-last-of-type(1)");
                let reasonRejectionDropdown = document.querySelector("#CF4Dm7QgdkJqiG5OqjBT");


                function opportunityDetailsClickHandler() {
                    if (status && status.querySelector('.n-base-selection-input[title="Abandon"], .hr-base-selection-input[title="Abandon"]')) {
                        reason.style.display = "block";
                    }
                    else {
                        reason.style.display = "none";
                    }

                    if (status && status.querySelector('.n-base-selection-input[title="Lost"], .hr-base-selection-input[title="Lost"]') ||
                        status && status.querySelector('.n-base-selection-input[title="Abandon"], .hr-base-selection-input[title="Abandon"]')) {
                        internalReview.style.display = "block";
                    }
                    else {
                        internalReview.style.display = "none";
                    }

                    if (reason?.querySelector('.n-base-selection-label, .hr-base-selection-label')?.innerText.includes("Other (note below)")) {
                        notes.style.display = "block";
                    }
                    else {
                        notes.style.display = "none";
                    }

                    if (lostReason?.querySelector('.n-base-selection-label, .hr-base-selection-label')?.innerText.includes("Other (note below)")) {
                        lostReasonNotes.style.display = "block";
                    }
                    else {
                        lostReasonNotes.style.display = "none";
                    }

                    statusDropdownObserver = new MutationObserver((mutationList) => {
                        statusTypeDropdownSelectedValue = mutationList[0]?.target.innerText;

                        if (mutationList[0]?.target.innerText !== "") {
                            if (status.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")?.innerText.includes("Abandon")) {
                                setTimeout(function () {
                                    reason.querySelector(".n-base-clear__placeholder, .hr-base-clear__placeholder").click();
                                }, 0);

                                setTimeout(function () {
                                    reason.querySelector(".n-base-clear__clear, .hr-base-clear__clear")?.click();
                                }, 0);

                                reason.style.display = "block";
                                internalReview.style.display = "block";
                                lostReasonNotes.style.display = "none";
                                notes.style.display = "none";
                            }
                            else if (status.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")?.innerText.includes("Lost")) {
                                setTimeout(function () {
                                    lostReason.querySelector(".n-base-clear__placeholder, .hr-base-clear__placeholder").click();
                                }, 0);

                                setTimeout(function () {
                                    lostReason.querySelector(".n-base-clear__clear, .hr-base-clear__clear")?.click();
                                }, 0);

                                internalReview.style.display = "block";
                                reason.style.display = "none";
                                notes.style.display = "none";
                                lostReasonNotes.style.display = "none";

                                lostReasonDropdownObserver = new MutationObserver((mutationList) => {
                                    if (lostReason.querySelector(".n-base-selection-label, .hr-base-selection-label")?.innerText.includes("Other (note below)")) {
                                        if (lostReasonNotes.style.display !== "block") {
                                            lostReasonNotes.style.display = "block";
                                        }
                                    }
                                    else {
                                        if (lostReasonNotes.style.display !== "none") {
                                            lostReasonNotes.style.display = "none";
                                        }
                                    }
                                });
                                lostReasonDropdownObserver.observe(document.querySelector("#select-id .n-base-selection-label, #select-id .hr-base-selection-label"), config);
                            }
                            else {
                                reason.style.display = "none";
                                lostReasonNotes.style.display = "none";
                                notes.style.display = "none";
                                internalReview.style.display = "none";
                            }
                        }
                    });
                    statusDropdownObserver.observe(document.querySelector("#OpportunityStatus .n-base-selection-label, #OpportunityStatus .hr-base-selection-label"), config);

                    reasonDropdownObserver = new MutationObserver((mutationList) => {
                        if (mutationList[0]?.target.innerText !== "") {
                            if (reason.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")?.innerText.includes("Other (note below)")) {
                                notes.style.display = "block";
                            }
                            else {
                                notes.style.display = "none";
                            }
                        }
                    });
                    reasonDropdownObserver.observe(document.querySelector("#YqwJnX6msAiaOtdVhD8R .n-base-selection-label, #YqwJnX6msAiaOtdVhD8R .hr-base-selection-label"), config);
                }

                function intakeTabClickHandler() {
                    if (caseEvaluationDropdown && caseEvaluationDropdown.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")?.innerText.includes("Decline")) {
                        reasonRejectionDiv.style.display = "block";
                    }
                    else {
                        reasonRejectionDiv.style.display = "none";
                    }

                    if (reasonRejectionDiv && reasonRejectionDiv.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")?.innerText.includes("Other (note below)")) {
                        RejectionNotesdiv.style.display = "block";
                    }
                    else {
                        RejectionNotesdiv.style.display = "none";
                    }

                    caseEvaluationeDropdownObserver = new MutationObserver((mutationList) => {
                        if (mutationList[0]?.target.innerText !== "") {
                            setTimeout(function () {
                                reasonRejectionDropdown.querySelector(".n-base-clear__placeholder, .hr-base-clear__placeholder").click();
                            }, 0);

                            setTimeout(function () {
                                reasonRejectionDropdown.querySelector(".n-base-clear__clear, .hr-base-clear__clear")?.click();
                            }, 0);

                            if (caseEvaluationDropdown.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")?.innerText.includes("Decline")) {
                                reasonRejectionDiv.style.display = "block";
                            }
                            else {
                                reasonRejectionDiv.style.display = "none";
                                RejectionNotesdiv.style.display = "none";
                            }
                        }
                    });
                    caseEvaluationeDropdownObserver.observe(document.querySelector("#\\33 vc5mZXgcA3mZ0upU2Jv .n-base-selection-label, #\\33 vc5mZXgcA3mZ0upU2Jv .hr-base-selection-label"), config);

                    reasonRejectionDropdownObserver = new MutationObserver((mutationList) => {
                        if (mutationList[0]?.target.innerText !== "") {
                            if (reasonRejectionDropdown.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")?.innerText.includes("Other (note below)")) {
                                RejectionNotesdiv.style.display = "block";
                            }
                            else {
                                RejectionNotesdiv.style.display = "none";
                            }
                        }
                    });
                    reasonRejectionDropdownObserver.observe(document.querySelector("#CF4Dm7QgdkJqiG5OqjBT .n-base-selection-label, #CF4Dm7QgdkJqiG5OqjBT .hr-base-selection-label"), config);
                }

                document.querySelectorAll(".wrapperHeader button")?.forEach((button) => {
                    if (button.innerText === "Opportunity Details" && button.classList.contains("bg-blue-50") && !isRunned) {
                        opportunityDetailsClickHandler();
                        isRunned = true;
                    }
                    else if (button.innerText === "Opportunity Details") {
                        button.onclick = opportunityDetailsClickHandler;
                    }
                });

                document.querySelectorAll(".wrapperHeader button")?.forEach((button) => {
                    if (button.innerText === "Intake Tab" && button.classList.contains("bg-blue-50") && !isRunned) {
                        intakeTabClickHandler();
                        isRunned = true;
                    }
                    else if (button.innerText === "Intake Tab") {
                        button.onclick = intakeTabClickHandler;
                    }
                })
            }

            observer = new MutationObserver(callback);
            observer.observe(document.body, config);
        }
        else if (window.location.href.includes("/v2/location/B01Xwlw7MUoY18oqAELD/opportunities/list")) {
            const config = {
                childList: true,
                subtree: true
            };

            let caseTypeDropdownSelectedValue = "";
            let referralSourceDropdownSelectedValue = "";
            let referralCaseTypeDropdownSelectedValue = "";
            let caseTypeDropdownObserver = null;
            let referralSourceDropdownObserver = null;
            let statusDropdownObserver = null;
            let talkedToOtherAttorneysDropdownObserver = null;
            let caseEvaluationDropdownObserver = null;
            let reasonForRejectionDropdownObserver = null;
            let noticeProvidedToSupervisorDropdownObserver = null;
            let filledForDisabilityDropdownObserver = null;
            let representedByAttorneyDropdownObserver = null;
            let currentlyWorkingDropdownObserver = null;
            let hospitalizedDropdownObserver = null;
            let referralCaseTypeDropdownObserver = null;

            const callback = function () {
                let caseTypeDropdown = document.querySelector("#gMuhpjoOKlqpzrbJoCsI");
                let referralSourceDropdown = document.querySelector("#J7Hz2oxdSI3c66HitG3z");
                let referralName = document.querySelector("#opportunitiesForm > div > div:nth-child(16)");
                let status = document.querySelector("#OpportunityStatus");
                let divs = document.querySelectorAll('#opportunitiesForm > div > div');
                let address = divs[11];
                let state = divs[divs.length - 4];
                let city = divs[divs.length - 3];
                let zip = divs[divs.length - 2];
                let internalReview = divs[divs.length - 5];
                let notes = divs[divs.length - 6];
                let reason = divs[divs.length - 7];
                let lostReasonNotes = divs[12];
                let lostReason = document.querySelector("#select-id");
                let talkedToOtherAttorneysDropdown = document.querySelector("#O8AftqFNmw8rvNxhHbAb");
                let attorneys = document.querySelector("#opportunitiesCustomFieldForm > div > div:last-of-type");
                let caseEvaluationDropdown = document.querySelector("#dig1Wv6PkrFZDKnR5t5Z");
                let reasonForRejectionDropdown = document.querySelector("#KOm4zTfJ2DF5QGE1ujiy");
                let reasonForRejection = document.querySelector("#opportunitiesCustomFieldForm > div > div:nth-last-of-type(2)");
                let reasonForRejectionNotes = document.querySelector("#opportunitiesCustomFieldForm > div > div:nth-last-of-type(1)");
                let noticeProvidedToSupervisorDropdown = document.querySelector("#\\36 73sHN6xiLLRWLj7HwLc");
                let oral = document.querySelector("#opportunitiesCustomFieldForm > div > div:nth-last-of-type(10)");
                let written = document.querySelector("#opportunitiesCustomFieldForm > div > div:nth-last-of-type(9)");
                let digital = document.querySelector("#opportunitiesCustomFieldForm > div > div:nth-last-of-type(8)");
                let wcReason = document.querySelector("#opportunitiesCustomFieldForm > div > div:nth-last-of-type(7)");
                let filedForDisabilityDropdown = document.querySelector("#pV6EAAnzkxylH6UvxiwI");
                let dateLocationOfDenial = document.querySelector("#opportunitiesCustomFieldForm > div > div:nth-of-type(6)");
                let representedByAttorneyDropdown = document.querySelector("#eeJPXD3M3HCL9xwG8Qz1");
                let attorneyName = document.querySelector("#opportunitiesCustomFieldForm > div > div:nth-of-type(11)");
                let currentlyWorkingDropdown = document.querySelector("#k17CIIcldPVtId5aeiTj");
                let monthlyEarnings = document.querySelector("#opportunitiesCustomFieldForm > div > div:nth-of-type(16)");
                let hospitalizedDropdown = document.querySelector("#\\31 S42ziLaJxyhBHK2JjeC");
                let dateOfHospitalization = document.querySelector("#opportunitiesCustomFieldForm > div > div:nth-of-type(19)");
                let referralCaseTypeDropdown = document.querySelector("#t84bKOF3ud6vfp6za3Iv");
                let referralDivs = document.querySelectorAll("#opportunitiesCustomFieldForm > div > div:nth-of-type(n+2):nth-of-type(-n+15)");

                function onClickHandler() {
                    document.querySelectorAll("#opportunitiesForm > div > div:nth-child(n+11):nth-child(-n+14)")?.forEach((dropDownContainer) => {
                        if (!dropDownContainer.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")) {
                            dropDownContainer.style.display = "none";
                        }
                    });

                    if (referralName && referralName.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")) {
                        referralName.style.display = "block";
                    }
                    else {
                        referralName.style.display = "none";
                    }

                    if (status && status.querySelector('.n-base-selection-input[title="Abandon"], .hr-base-selection-input[title="Abandon"]')) {
                        reason.style.display = "block";
                    }
                    else {
                        reason.style.display = "none";
                    }

                    if ((status && status.querySelector('.n-base-selection-input[title="Abandon"], .hr-base-selection-input[title="Abandon"]') ||
                        status && status.querySelector('.n-base-selection-input[title="Lost"], .hr-base-selection-input[title="Lost"]'))) {
                        internalReview.style.display = "block";
                    }
                    else {
                        internalReview.style.display = "none";
                    }

                    if (reason && reason.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")?.innerText.includes("Other (note below)")) {
                        notes.style.display = "block";
                    }
                    else {
                        notes.style.display = "none";
                    }

                    if (lostReason?.querySelector('.n-base-selection-label, .hr-base-selection-label')?.innerText.includes("Other (note below)")) {
                        lostReasonNotes.style.display = "block";
                    }
                    else {
                        lostReasonNotes.style.display = "none";
                    }

                    if (reason.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")?.innerText.includes("Property damage only") ||
                        reason.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")?.innerText.includes("At-Fault Driver")) {
                        address.style.display = "block";
                        state.style.display = "block";
                        city.style.display = "block";
                        zip.style.display = "block";
                    }
                    else {
                        address.style.display = "none";
                        state.style.display = "none";
                        city.style.display = "none";
                        zip.style.display = "none";
                    }

                    statusDropdownObserver = new MutationObserver((mutationList) => {
                        statusTypeDropdownSelectedValue = mutationList[0]?.target.innerText;

                        if (mutationList[0]?.target.innerText !== "") {
                            if (status.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")?.innerText.includes("Abandon")) {
                                setTimeout(function () {
                                    reason.querySelector(".n-base-clear__placeholder, .hr-base-clear__placeholder").click();
                                }, 0);

                                setTimeout(function () {
                                    reason.querySelector(".n-base-clear__clear, .hr-base-clear__clear")?.click();
                                }, 0);

                                reason.style.display = "block";
                                internalReview.style.display = "block";
                                notes.style.display = "none";
                            }
                            else if (status.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")?.innerText.includes("Lost")) {
                                setTimeout(function () {
                                    lostReason.querySelector(".n-base-clear__placeholder, .hr-base-clear__placeholder").click();
                                }, 0);

                                setTimeout(function () {
                                    lostReason.querySelector(".n-base-clear__clear, .hr-base-clear__clear")?.click();
                                }, 0);

                                internalReview.style.display = "block";
                                reason.style.display = "none";
                                notes.style.display = "none";

                                lostReasonDropdownObserver = new MutationObserver((mutationList) => {
                                    if (lostReason.querySelector(".n-base-selection-label, .hr-base-selection-label")?.innerText.includes("Other (note below)")) {
                                        if (lostReasonNotes.style.display !== "block") {
                                            lostReasonNotes.style.display = "block";
                                        }
                                    }
                                    else {
                                        if (lostReasonNotes.style.display !== "none") {
                                            lostReasonNotes.style.display = "none";
                                        }
                                    }
                                });
                                lostReasonDropdownObserver.observe(document.querySelector("#select-id .n-base-selection-label, #select-id .hr-base-selection-label"), config);
                            }
                            else {
                                reason.style.display = "none";
                                notes.style.display = "none";
                                internalReview.style.display = "none";
                                lostReasonNotes.style.display = "none";
                            }
                        }
                    });
                    statusDropdownObserver.observe(document.querySelector("#OpportunityStatus .n-base-selection-label, #OpportunityStatus .hr-base-selection-label"), config);

                    reasonDropdownObserver = new MutationObserver((mutationList) => {
                        if (mutationList[0]?.target.innerText !== "") {
                            if (reason.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")?.innerText.includes("Other (note below)")) {
                                notes.style.display = "block";
                                address.style.display = "none";
                                state.style.display = "none";
                                city.style.display = "none";
                                zip.style.display = "none";
                            }
                            else if (reason.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")?.innerText.includes("Property damage only") ||
                                reason.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")?.innerText.includes("At-Fault Driver")) {
                                notes.style.display = "none";
                                address.style.display = "block";
                                state.style.display = "block";
                                city.style.display = "block";
                                zip.style.display = "block";
                            }
                            else {
                                notes.style.display = "none";
                                address.style.display = "none";
                                state.style.display = "none";
                                city.style.display = "none";
                                zip.style.display = "none";
                            }
                        }
                    });
                    reasonDropdownObserver.observe(document.querySelector("#sYMgTRYnlAZ3vS2hPtwG .n-base-selection-label, #sYMgTRYnlAZ3vS2hPtwG .hr-base-selection-label"), config);

                    caseTypeDropdownObserver = new MutationObserver((mutationList) => {
                        if (mutationList[0]?.target.innerText !== "") {
                            document.querySelectorAll("#opportunitiesForm > div > div:nth-child(n+11):nth-child(-n+14)")?.forEach((caseTypeDropdownContainer, idx) => {
                                caseTypeDropdownSelectedValue = mutationList[0]?.target.innerText;

                                if (idx === 0) {
                                    setTimeout(function () {
                                        document.querySelectorAll("#opportunitiesForm > div > div:nth-child(n+11):nth-child(-n+14)")?.forEach((dropdownToClear) => {
                                            dropdownToClear.querySelector(".n-base-clear__placeholder, .hr-base-clear__placeholder").click();
                                        });
                                    }, 0);

                                    setTimeout(function () {
                                        document.querySelectorAll("#opportunitiesForm > div > div:nth-child(n+11):nth-child(-n+14)")?.forEach((dropdownToClear) => {
                                            dropdownToClear.querySelector(".n-base-clear__clear, .hr-base-clear__clear")?.click();
                                        });
                                    }, 0);
                                }


                                if (caseTypeDropdownContainer.querySelector(".n-form-item-label__text, .hr-form-item-label__text")?.innerText.includes(caseTypeDropdownSelectedValue + " - Case Type")) {
                                    caseTypeDropdownContainer.style.display = "block";
                                }
                                else {
                                    caseTypeDropdownContainer.style.display = "none";
                                }
                            });
                        }
                    });
                    caseTypeDropdownObserver.observe(document.querySelector("#gMuhpjoOKlqpzrbJoCsI .n-base-selection-label, #gMuhpjoOKlqpzrbJoCsI .hr-base-selection-label"), config);

                    referralSourceDropdownObserver = new MutationObserver((mutationList) => {
                        if (mutationList[0]?.target.innerText !== "") {
                            referralSourceDropdownSelectedValue = mutationList[0]?.target.innerText;

                            if (referralSourceDropdownSelectedValue === "Former/Current Client" ||
                                referralSourceDropdownSelectedValue === "Friend" ||
                                referralSourceDropdownSelectedValue === "Another attorney") {
                                referralName.style.display = "block";
                            }
                            else {
                                referralName.style.display = "none";
                            }
                        }
                    });
                    referralSourceDropdownObserver.observe(document.querySelector("#J7Hz2oxdSI3c66HitG3z .n-base-selection-label, #J7Hz2oxdSI3c66HitG3z .hr-base-selection-label"), config);
                }

                function additionalInfoClickHandler() {
                    if (talkedToOtherAttorneysDropdown && talkedToOtherAttorneysDropdown.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")?.innerText.includes("Yes")) {
                        attorneys.style.display = "block";
                    }
                    else {
                        attorneys.style.display = "none";
                    }

                    talkedToOtherAttorneysDropdownObserver = new MutationObserver((mutationList) => {
                        if (mutationList[0]?.target.innerText !== "") {
                            if (talkedToOtherAttorneysDropdown.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")?.innerText.includes("Yes")) {
                                attorneys.style.display = "block";
                            }
                            else {
                                attorneys.style.display = "none";
                            }
                        }
                    });
                    talkedToOtherAttorneysDropdownObserver.observe(document.querySelector("#O8AftqFNmw8rvNxhHbAb .n-base-selection-label, #O8AftqFNmw8rvNxhHbAb .hr-base-selection-label"), config);
                }

                function piInitialScreeningClickHandler() {
                    if (caseEvaluationDropdown && caseEvaluationDropdown.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")?.innerText.includes("Decline")) {
                        reasonForRejection.style.display = "block";
                    }
                    else {
                        reasonForRejection.style.display = "none";
                    }

                    if (reasonForRejectionDropdown && reasonForRejectionDropdown.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")?.innerText.includes("Other (note below)")) {
                        reasonForRejectionNotes.style.display = "block";
                    }
                    else {
                        reasonForRejectionNotes.style.display = "none";
                    }

                    caseEvaluationDropdownObserver = new MutationObserver((mutationList) => {
                        if (mutationList[0]?.target.innerText !== "") {
                            setTimeout(function () {
                                reasonForRejectionDropdown.querySelector(".n-base-clear__placeholder, .hr-base-clear__placeholder").click();
                            }, 0);

                            setTimeout(function () {
                                reasonForRejectionDropdown.querySelector(".n-base-clear__clear, .hr-base-clear__clear")?.click();
                            }, 0);

                            if (caseEvaluationDropdown.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")?.innerText.includes("Decline")) {
                                reasonForRejection.style.display = "block";
                            }
                            else {
                                reasonForRejection.style.display = "none";
                                reasonForRejectionNotes.style.display = "none";
                            }
                        }
                    });
                    caseEvaluationDropdownObserver.observe(document.querySelector("#dig1Wv6PkrFZDKnR5t5Z .n-base-selection-label, #dig1Wv6PkrFZDKnR5t5Z .hr-base-selection-label"), config);

                    reasonForRejectionDropdownObserver = new MutationObserver((mutationList) => {
                        if (mutationList[0]?.target.innerText !== "") {
                            if (reasonForRejectionDropdown.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")?.innerText.includes("Other (note below)")) {
                                reasonForRejectionNotes.style.display = "block";
                            }
                            else {
                                reasonForRejectionNotes.style.display = "none";
                            }
                        }
                    });
                    reasonForRejectionDropdownObserver.observe(document.querySelector("#KOm4zTfJ2DF5QGE1ujiy .n-base-selection-label, #KOm4zTfJ2DF5QGE1ujiy .hr-base-selection-label"), config);
                }

function wcInitialScreeningClickHandler() {

    // ================= LONGSHORE DROPDOWN =================
    const longshoreDropdown = document.querySelector("#p5uWIRuomnhSVdpWEsbt"); // <-- confirm this ID
    const longshoreLabel = document.querySelector("#p5uWIRuomnhSVdpWEsbt .n-base-selection-label, #p5uWIRuomnhSVdpWEsbt .hr-base-selection-label");

    const assignedToBoat = document.querySelector("#IImwN1VyaUrjbg8XUBls")?.closest(".hr-form-item");
    const boatDocked = document.querySelector("#d9cguW7pgTUft7AUTxJo")?.closest(".hr-form-item");
    const primarilyLand = document.querySelector("#EIbZ5DDvwrM7jgiSeaGk")?.closest(".hr-form-item");

    function handleLongshoreLogic() {
        const selectedText = longshoreDropdown
            ?.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")
            ?.innerText || "";

        if (selectedText.includes("Yes")) {
            if (assignedToBoat) assignedToBoat.style.display = "block";
            if (boatDocked) boatDocked.style.display = "block";
            if (primarilyLand) primarilyLand.style.display = "block";
        } else {
            if (assignedToBoat) assignedToBoat.style.display = "none";
            if (boatDocked) boatDocked.style.display = "none";
            if (primarilyLand) primarilyLand.style.display = "none";
        }
    }

    // Run once on load
    handleLongshoreLogic();

    // Observe Longshore dropdown changes
    if (longshoreLabel) {
        const longshoreObserver = new MutationObserver(() => {
            handleLongshoreLogic();
        });

        longshoreObserver.observe(longshoreLabel, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }

    // ================= EXISTING NOTICE OBSERVER (unchanged) =================
    noticeProvidedToSupervisorDropdownObserver.observe(
        document.querySelector("#\\36 73sHN6xiLLRWLj7HwLc .n-base-selection-label, #\\36 73sHN6xiLLRWLj7HwLc .hr-base-selection-label"),
        config
    );
}





                function socialSecurityDisabilityClickHandler() {
                    if (filedForDisabilityDropdown && filedForDisabilityDropdown.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")?.innerText.includes("Yes")) {
                        dateLocationOfDenial.style.display = "block";
                    }
                    else {
                        dateLocationOfDenial.style.display = "none";
                    }

                    if (representedByAttorneyDropdown && representedByAttorneyDropdown.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")?.innerText.includes("Yes")) {
                        attorneyName.style.display = "block";
                    }
                    else {
                        attorneyName.style.display = "none";
                    }

                    if (currentlyWorkingDropdown && currentlyWorkingDropdown.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")?.innerText.includes("Yes")) {
                        monthlyEarnings.style.display = "block";
                    }
                    else {
                        monthlyEarnings.style.display = "none";
                    }

                    if (hospitalizedDropdown && hospitalizedDropdown.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")?.innerText.includes("Yes")) {
                        dateOfHospitalization.style.display = "block";
                    }
                    else {
                        dateOfHospitalization.style.display = "none";
                    }

                    filledForDisabilityDropdownObserver = new MutationObserver((mutationList) => {
                        if (mutationList[0]?.target.innerText !== "") {
                            if (filedForDisabilityDropdown.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")?.innerText.includes("Yes")) {
                                dateLocationOfDenial.style.display = "block";
                            }
                            else {
                                dateLocationOfDenial.style.display = "none";
                            }
                        }
                    });
                    filledForDisabilityDropdownObserver.observe(document.querySelector("#pV6EAAnzkxylH6UvxiwI .n-base-selection-label, #pV6EAAnzkxylH6UvxiwI .hr-base-selection-label"), config);

                    representedByAttorneyDropdownObserver = new MutationObserver((mutationList) => {
                        if (mutationList[0]?.target.innerText !== "") {
                            if (representedByAttorneyDropdown.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")?.innerText.includes("Yes")) {
                                attorneyName.style.display = "block";
                            }
                            else {
                                attorneyName.style.display = "none";
                            }
                        }
                    });
                    representedByAttorneyDropdownObserver.observe(document.querySelector("#eeJPXD3M3HCL9xwG8Qz1 .n-base-selection-label, #eeJPXD3M3HCL9xwG8Qz1 .hr-base-selection-label"), config);

                    currentlyWorkingDropdownObserver = new MutationObserver((mutationList) => {
                        if (mutationList[0]?.target.innerText !== "") {
                            if (currentlyWorkingDropdown.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")?.innerText.includes("Yes")) {
                                monthlyEarnings.style.display = "block";
                            }
                            else {
                                monthlyEarnings.style.display = "none";
                            }
                        }
                    });
                    currentlyWorkingDropdownObserver.observe(document.querySelector("#k17CIIcldPVtId5aeiTj .n-base-selection-label, #k17CIIcldPVtId5aeiTj .hr-base-selection-label"), config);

                    hospitalizedDropdownObserver = new MutationObserver((mutationList) => {
                        if (mutationList[0]?.target.innerText !== "") {
                            if (hospitalizedDropdown.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")?.innerText.includes("Yes")) {
                                dateOfHospitalization.style.display = "block";
                            }
                            else {
                                dateOfHospitalization.style.display = "none";
                            }
                        }
                    });
                    hospitalizedDropdownObserver.observe(document.querySelector("#\\31 S42ziLaJxyhBHK2JjeC .n-base-selection-label, #\\31 S42ziLaJxyhBHK2JjeC .hr-base-selection-label"), config);
                }

                function referralTabClickHandler() {
                    referralDivs?.forEach(div => {
                        if (div.querySelector(".n-form-item-label__text, .hr-form-item-label__text")?.innerText.includes("Referral Partner - " + referralCaseTypeDropdown.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")?.innerText)) {
                            div.style.display = "block";
                        }
                        else {
                            div.style.display = "none";
                        }
                    })

                    referralCaseTypeDropdownObserver = new MutationObserver((mutationList) => {
                        referralCaseTypeDropdownSelectedValue = mutationList[0]?.target.innerText;

                        if (mutationList[0]?.target.innerText !== "") {
                            referralDivs?.forEach(div => {
                                if (div.querySelector(".n-form-item-label__text, .hr-form-item-label__text")?.innerText.includes("Referral Partner - " + referralCaseTypeDropdownSelectedValue)) {
                                    div.style.display = "block";
                                }
                                else {
                                    div.style.display = "none";

                                    setTimeout(function () {
                                        div.querySelector(".n-base-clear__placeholder, .hr-base-clear__placeholder").click();
                                    }, 0);

                                    setTimeout(function () {
                                        div.querySelector(".n-base-clear__clear, .hr-base-clear__clear")?.click();
                                    }, 0);
                                }
                            })
                        }
                    });
                    referralCaseTypeDropdownObserver.observe(document.querySelector("#t84bKOF3ud6vfp6za3Iv .n-base-selection-label, #t84bKOF3ud6vfp6za3Iv .hr-base-selection-label"), config);
                }

                document.querySelectorAll(".wrapperHeader button")?.forEach((button) => {
                    if (button.innerText === "Opportunity Details" && button.classList.contains("bg-blue-50") && !isRunned) {
                        onClickHandler();
                        isRunned = true;
                    }
                    else if (button.innerText === "Opportunity Details") {
                        button.onclick = onClickHandler;
                    }
                })

                document.querySelectorAll(".wrapperHeader button")?.forEach((button) => {
                    if (button.innerText === "Additional Info" && button.classList.contains("bg-blue-50") && !isRunned) {
                        additionalInfoClickHandler();
                        isRunned = true;
                    }
                    else if (button.innerText === "Additional Info") {
                        button.onclick = additionalInfoClickHandler;
                    }
                })

                document.querySelectorAll(".wrapperHeader button")?.forEach((button) => {
                    if (button.innerText === "PI Initial Screening" && button.classList.contains("bg-blue-50") && !isRunned) {
                        piInitialScreeningClickHandler();
                        isRunned = true;
                    }
                    else if (button.innerText === "PI Initial Screening") {
                        button.onclick = piInitialScreeningClickHandler;
                    }
                })

                document.querySelectorAll(".wrapperHeader button")?.forEach((button) => {
                    if (button.innerText === "WC - Initial Screening" && button.classList.contains("bg-blue-50") && !isRunned) {
                        wcInitialScreeningClickHandler();
                        isRunned = true;
                    }
                    else if (button.innerText === "WC - Initial Screening") {
                        button.onclick = wcInitialScreeningClickHandler;
                    }
                })

                document.querySelectorAll(".wrapperHeader button")?.forEach((button) => {
                    if (button.innerText === "Social Security Disability" && button.classList.contains("bg-blue-50") && !isRunned) {
                        socialSecurityDisabilityClickHandler();
                        isRunned = true;
                    }
                    else if (button.innerText === "Social Security Disability") {
                        button.onclick = socialSecurityDisabilityClickHandler;
                    }
                })

                document.querySelectorAll(".wrapperHeader button")?.forEach((button) => {
                    if (button.innerText === "Referral Tab" && button.classList.contains("bg-blue-50") && !isRunned) {
                        referralTabClickHandler();
                        isRunned = true;
                    }
                    else if (button.innerText === "Referral Tab") {
                        button.onclick = referralTabClickHandler;
                    }
                })
            }

            observer = new MutationObserver(callback);
            observer.observe(document.body, config);
        }
        else if (window.location.href.includes("/v2/location/lBnuc60iFX6sUeorE7Oi/opportunities/list")) {
            const config = { childList: true, subtree: true };
            let lastCaseType = "";
        
            const callback = function () {
                const caseTypeDropdown = document.querySelector("#xGQWhy7cs7Gxg6lUjTiP");
                const formItems = document.querySelectorAll('#opportunitiesForm .hr-form-item, #opportunitiesForm .n-form-item');
                
                if (!caseTypeDropdown || formItems.length === 0) return;
        
                // 1. Identify your specific fields by their label text
                let emplyementLawField = null;
                let workplaceInjuryField = null;
                let genericCaseTypeField = null;
        
                formItems.forEach(item => {
                    const label = item.querySelector('.hr-form-item-label__text, .n-form-item-label__text')?.textContent?.trim();
                    if (label === "Employment Law - Case Type") emplyementLawField = item;
                    if (label === "Workplace Injury - Case Type") workplaceInjuryField = item;
                    if (label === "Case Type") genericCaseTypeField = item; // This ensures the generic one is found
                });
        
                const updateVisibility = () => {
                    const selectedValue = caseTypeDropdown.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")?.innerText?.trim();
                    
                    if (selectedValue === lastCaseType) return;
                    lastCaseType = selectedValue;
        
                    // Hide them all by default
                    if (emplyementLawField) emplyementLawField.style.display = "none";
                    if (workplaceInjuryField) workplaceInjuryField.style.display = "none";
                    
                    // Generic Case Type usually stays visible, but if you want it hidden until a selection is made:
                    // if (genericCaseTypeField) genericCaseTypeField.style.display = "none";
        
                    // Show based on selection
                    if (selectedValue === "Employment Law" && emplyementLawField) {
                        emplyementLawField.style.display = "block";
                    } else if (selectedValue === "Workplace Injury" && workplaceInjuryField) {
                        workplaceInjuryField.style.display = "block";
                    }
                };
        
                // 2. Attach Observer to the dropdown label to watch for changes
                const dropdownLabel = caseTypeDropdown.querySelector(".n-base-selection-label, .hr-base-selection-label");
                if (dropdownLabel && !caseTypeDropdown._hooked) {
                    caseTypeDropdown._hooked = true;
                    const obs = new MutationObserver(updateVisibility);
                    obs.observe(dropdownLabel, config);
                }
        
                // Run once initially
                updateVisibility();
            };
        
            observer = new MutationObserver(callback);
            observer.observe(document.body, config);
        }
        else if (window.location.href.includes("/v2/location/ks1ttcTX59wuuOzroTRR/opportunities/list")) {
            const config = {
                childList: true,
                subtree: true
            };

            let statusDropdownObserver = null;
            let reasonDropdownObserver = null;
            let statusTypeDropdownSelectedValue = "";
            let caseTypeDropdownObserver = null;
            let caseEvaluationeDropdownObserver = null;
            let reasonRejectionDropdownObserver = null;
            let lostReasonDropdownObserver = null;
            let referralCaseTypeDropdownObserver = null;
            let referralCaseTypeDropdownSelectedValue = "";

            const callback = function () {
                let status = document.querySelector("#OpportunityStatus");
                let divs = document.querySelectorAll('#opportunitiesForm > div > div');
                let internalReview = divs[divs.length - 2];
                let notes = divs[divs.length - 3];
                let reason = divs[divs.length - 4];
                let lostReasonNotes = divs[divs.length - 5];
                let lostReason = document.querySelector("#select-id");
                let personalInjuryCaseTypeDropdown = document.querySelector("#IoMWDX3bJGwY3y0Imz8x");
                let caseEvaluationDropdown = document.querySelector("#nfwsz6coKvaO4Sc5gY0S");
                let reasonRejectionDiv = document.querySelector('#opportunitiesCustomFieldForm > div > div:nth-last-child(2)');
                let RejectionNotesdiv = document.querySelector('#opportunitiesCustomFieldForm > div > div:nth-last-child(1)');
                let reasonRejectionDropdown = document.querySelector("#WwhyBOIOY9RqSaW29PQi");
                let referralCaseTypeDropdown = document.querySelector("#TEN9cSF5gTEFRGNRrpzP");
                let referralDivs = Array.from(document.querySelectorAll('#opportunitiesCustomFieldForm > div > div'))?.slice(1, 4);

                function opportunityDetailsClickHandler() {
                    if (status && status.querySelector('.n-base-selection-input[title="Abandon"], .hr-base-selection-input[title="Abandon"]')) {
                        reason.style.display = "block";
                    }
                    else {
                        reason.style.display = "none";
                    }

                    if (status && status.querySelector('.n-base-selection-input[title="Lost"], .hr-base-selection-input[title="Lost"]') ||
                        status && status.querySelector('.n-base-selection-input[title="Abandon"], .hr-base-selection-input[title="Abandon"]')) {
                        internalReview.style.display = "block";
                    }
                    else {
                        internalReview.style.display = "none";
                    }

                    if (reason?.querySelector('.n-base-selection-label, .hr-base-selection-label')?.innerText.includes("Other (note below)")) {
                        notes.style.display = "block";
                    }
                    else {
                        notes.style.display = "none";
                    }

                    if (lostReason?.querySelector('.n-base-selection-label, .hr-base-selection-label')?.innerText.includes("Other (note below in the opportunity card)")) {
                        lostReasonNotes.style.display = "block";
                    }
                    else {
                        lostReasonNotes.style.display = "none";
                    }

                    statusDropdownObserver = new MutationObserver((mutationList) => {
                        statusTypeDropdownSelectedValue = mutationList[0]?.target.innerText;

                        if (mutationList[0]?.target.innerText !== "") {
                            if (status.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")?.innerText.includes("Abandon")) {
                                setTimeout(function () {
                                    reason.querySelector(".n-base-clear__placeholder, .hr-base-clear__placeholder").click();
                                }, 0);

                                setTimeout(function () {
                                    reason.querySelector(".n-base-clear__clear, .hr-base-clear__clear")?.click();
                                }, 0);

                                reason.style.display = "block";
                                internalReview.style.display = "block";
                                lostReasonNotes.style.display = "none";
                                notes.style.display = "none";
                            }
                            else if (status.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")?.innerText.includes("Lost")) {
                                setTimeout(function () {
                                    lostReason.querySelector(".n-base-clear__placeholder, .hr-base-clear__placeholder").click();
                                }, 0);

                                setTimeout(function () {
                                    lostReason.querySelector(".n-base-clear__clear, .hr-base-clear__clear")?.click();
                                }, 0);

                                internalReview.style.display = "block";
                                reason.style.display = "none";
                                notes.style.display = "none";
                                lostReasonNotes.style.display = "none";

                                lostReasonDropdownObserver = new MutationObserver((mutationList) => {
                                    if (lostReason.querySelector(".n-base-selection-label, .hr-base-selection-label")?.innerText.includes("Other (note below in the opportunity card)")) {
                                        if (lostReasonNotes.style.display !== "block") {
                                            lostReasonNotes.style.display = "block";
                                        }
                                    }
                                    else {
                                        if (lostReasonNotes.style.display !== "none") {
                                            lostReasonNotes.style.display = "none";
                                        }
                                    }
                                });
                                lostReasonDropdownObserver.observe(document.querySelector("#select-id .n-base-selection-label, #select-id .hr-base-selection-label"), config);
                            }
                            else {
                                reason.style.display = "none";
                                lostReasonNotes.style.display = "none";
                                notes.style.display = "none";
                                internalReview.style.display = "none";
                            }
                        }
                    });
                    statusDropdownObserver.observe(document.querySelector("#OpportunityStatus .n-base-selection-label, #OpportunityStatus .hr-base-selection-label"), config);

                    reasonDropdownObserver = new MutationObserver((mutationList) => {
                        if (mutationList[0]?.target.innerText !== "") {
                            if (reason.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")?.innerText.includes("Other (note below)")) {
                                notes.style.display = "block";
                            }
                            else {
                                notes.style.display = "none";
                            }
                        }
                    });
                    reasonDropdownObserver.observe(document.querySelector("#l4F9gqRXs1T0bcrK2vN2 .n-base-selection-label, #l4F9gqRXs1T0bcrK2vN2 .hr-base-selection-label"), config);
                }

               function intakeScreeningClickHandler() {

    // === ELEMENT REFERENCES ===
    const caseEvaluationDropdown = document.querySelector(
        "#nfwsz6coKvaO4Sc5gY0S"
    );

    const reasonRejectionDiv = document.querySelector(
        "#WwhyBOIOY9RqSaW29PQi"
    )?.closest(".hr-form-item");

    const RejectionNotesdiv = document.querySelector(
        "#RejectionNotes"
    )?.closest(".hr-form-item");

    const rejectionDetailsDiv = document.querySelector(
        "#OD4tJMdt1czKQieqgj0Y"
    )?.closest(".hr-form-item");

    const config = { childList: true, subtree: true };

    // === HELPER ===
    function isDeclineSelected() {
        return caseEvaluationDropdown
            ?.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")
            ?.innerText.includes("Decline");
    }

    // === INITIAL STATE ===
    const decline = isDeclineSelected();

    reasonRejectionDiv.style.display = decline ? "block" : "none";
    rejectionDetailsDiv.style.display = decline ? "block" : "none";

    if (
        reasonRejectionDiv
            ?.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")
            ?.innerText.includes("Other (note below)")
    ) {
        RejectionNotesdiv.style.display = "block";
    } else {
        RejectionNotesdiv.style.display = "none";
    }

    // === CASE EVALUATION OBSERVER ===
    const caseEvaluationeDropdownObserver = new MutationObserver(() => {

        setTimeout(() => {
            document.querySelector(
                "#WwhyBOIOY9RqSaW29PQi .n-base-clear__placeholder, #WwhyBOIOY9RqSaW29PQi .hr-base-clear__placeholder"
            )?.click();

            document.querySelector(
                "#WwhyBOIOY9RqSaW29PQi .n-base-clear__clear, #WwhyBOIOY9RqSaW29PQi .hr-base-clear__clear"
            )?.click();
        }, 0);

        const decline = isDeclineSelected();

        reasonRejectionDiv.style.display = decline ? "block" : "none";
        rejectionDetailsDiv.style.display = decline ? "block" : "none";

        if (!decline) {
            RejectionNotesdiv.style.display = "none";
        }
    });

    caseEvaluationeDropdownObserver.observe(
        document.querySelector(
            "#nfwsz6coKvaO4Sc5gY0S .n-base-selection-label, #nfwsz6coKvaO4Sc5gY0S .hr-base-selection-label"
        ),
        config
    );

    // === REASON FOR REJECTION OBSERVER ===
    const reasonRejectionDropdownObserver = new MutationObserver(() => {

        if (
            reasonRejectionDiv
                ?.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")
                ?.innerText.includes("Other (note below)")
        ) {
            RejectionNotesdiv.style.display = "block";
        } else {
            RejectionNotesdiv.style.display = "none";
        }
    });

    reasonRejectionDropdownObserver.observe(
        document.querySelector(
            "#WwhyBOIOY9RqSaW29PQi .n-base-selection-label, #WwhyBOIOY9RqSaW29PQi .hr-base-selection-label"
        ),
        config
    );
}


                function referralTabClickHandler() {
                    referralDivs?.forEach(div => {
                        if (div.querySelector(".n-form-item-label__text, .hr-form-item-label__text")?.innerText.includes("Referral Partner - " + referralCaseTypeDropdown.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")?.innerText)) {
                            div.style.display = "block";
                        }
                        else {
                            div.style.display = "none";
                        }
                    })

                    referralCaseTypeDropdownObserver = new MutationObserver((mutationList) => {
                        referralCaseTypeDropdownSelectedValue = mutationList[0]?.target.innerText;

                        if (mutationList[0]?.target.innerText !== "") {
                            referralDivs?.forEach(div => {
                                if (div.querySelector(".n-form-item-label__text, .hr-form-item-label__text")?.innerText.includes("Referral Partner - " + referralCaseTypeDropdownSelectedValue)) {
                                    div.style.display = "block";
                                }
                                else {
                                    div.style.display = "none";

                                    setTimeout(function () {
                                        div.querySelector(".n-base-clear__placeholder, .hr-base-clear__placeholder").click();
                                    }, 0);

                                    setTimeout(function () {
                                        div.querySelector(".n-base-clear__clear, .hr-base-clear__clear")?.click();
                                    }, 0);
                                }
                            })
                        }
                    });
                    referralCaseTypeDropdownObserver.observe(document.querySelector("#TEN9cSF5gTEFRGNRrpzP .n-base-selection-label, #TEN9cSF5gTEFRGNRrpzP .hr-base-selection-label"), config);
                }

                document.querySelectorAll(".wrapperHeader button")?.forEach((button) => {
                    if (button.innerText === "Opportunity Details" && button.classList.contains("bg-blue-50") && !isRunned) {
                        opportunityDetailsClickHandler();
                        isRunned = true;
                    }
                    else if (button.innerText === "Opportunity Details") {
                        button.onclick = opportunityDetailsClickHandler;
                    }
                });

                document.querySelectorAll(".wrapperHeader button")?.forEach((button) => {
                    if (button.innerText === "Intake Screening" && button.classList.contains("bg-blue-50") && !isRunned) {
                        intakeScreeningClickHandler();
                        isRunned = true;
                    }
                    else if (button.innerText === "Intake Screening") {
                        button.onclick = intakeScreeningClickHandler;
                    }
                })

                document.querySelectorAll(".wrapperHeader button")?.forEach((button) => {
                    if (button.innerText === "Referral Tab" && button.classList.contains("bg-blue-50") && !isRunned) {
                        referralTabClickHandler();
                        isRunned = true;
                    }
                    else if (button.innerText === "Referral Tab") {
                        button.onclick = referralTabClickHandler;
                    }
                })
            }

            observer = new MutationObserver(callback);
            observer.observe(document.body, config);
        }
        else if (window.location.href.includes("/v2/location/uQ3PGEfahzk7rpscwzWT/opportunities/list")) {
            const config = {
                childList: true,
                subtree: true
            };

            let contactTypeDropdownObserver = null;
            let feeTypeDropdownObserver = null;
            let referralTypeDropdownObserver = null;
            let statusDropdownObserver = null;
            let reasonDropdownObserver = null;
            let statusTypeDropdownSelectedValue = "";
            let caseTypeDropdownObserver = null;
            let caseEvaluationeDropdownObserver = null;
            let reasonRejectionDropdownObserver = null;
            let lostReasonDropdownObserver = null;
            let referralSourceDropdownObserver = null;
            let referralCaseTypeDropdownSelectedValue = "";
            let referralCaseTypeDropdownObserver = null;

            function callback() {
                let contactTypeDropdown = document.querySelector("#xPZNYtJ4SoezUTrsc8RU");
                let minorsName = document.querySelector("#opportunitiesCustomFieldForm > div > div:is(:nth-of-type(2)");
                let parentName = document.querySelector("#opportunitiesCustomFieldForm > div > div:is(:nth-of-type(3)");
                let authorizedRepresentative = document.querySelector("#opportunitiesCustomFieldForm > div > div:is(:nth-of-type(4)");
                let deceasedName = document.querySelector("#opportunitiesCustomFieldForm > div > div:is(:nth-of-type(5)");
                let feeTypeDropdown = document.querySelector("#\\34 g5BbKfiJpqK3YrNkxlQ");
                let clientWillPay = document.querySelectorAll("#opportunitiesCustomFieldForm > div > div:nth-of-type(7), #opportunitiesCustomFieldForm > div > div:nth-of-type(8)")
                let subBlankFeeFields = document.querySelectorAll("#opportunitiesCustomFieldForm > div > div:nth-of-type(9), #opportunitiesCustomFieldForm > div > div:nth-of-type(10), #opportunitiesCustomFieldForm > div > div:nth-of-type(11)")
                let mvaNonmvaAdultDropdown = document.querySelector("#RX9yLFWoALdJyDL8Wmw0");
                let basicFullMinorDropdown = document.querySelector("#\\31 3RsLb5ZxyM1Ug7gYi6z");;
                let referralTypeDropdown = document.querySelector("#\\31 UcJnxQEOlIkXEYVYI9W");
                let mvaNonmvaDeceased = document.querySelector("#\\35 L8iF25rGQzPUQJIDIIZ");
                let attorney = document.querySelector("#opportunitiesCustomFieldForm > div > div:is(:nth-of-type(13)");
                let status = document.querySelector("#OpportunityStatus");
                let divs = document.querySelectorAll('#opportunitiesForm > div > div');
                let internalReview = divs[divs.length - 2];
                let notes = divs[divs.length - 3];
                let reason = divs[divs.length - 4];
                let lostReasonNotes = divs[divs.length - 11];
                let lostReason = document.querySelector("#select-id");
                let referralSourceDropdown = document.querySelector("#\\33 gIVTJO0inOZUmAADQgc");
                let formerCurrentClient = divs[divs.length - 7];
                let friendName = divs[divs.length - 6];
                let anotherAttorney = divs[divs.length - 5];
                let caseEvaluationDropdown = document.querySelector("#en9d9XLyV1tSlWCsKnI1");
                let reasonRejectionDiv = document.querySelector('#opportunitiesCustomFieldForm > div > div:nth-last-child(2)');
                let RejectionNotesdiv = document.querySelector('#opportunitiesCustomFieldForm > div > div:nth-last-child(1)');
                let reasonRejectionDropdown = document.querySelector("#bdAZ7TAVuP92KFmCZ3Fd");
                let referralCaseTypeDropdown = document.querySelector("#uuQPykQvEdgXxjG89fBD");
                let referralDivs = document.querySelectorAll("#opportunitiesCustomFieldForm > div > div:nth-of-type(n+2):nth-of-type(-n+3)");

                function opportunityDetailsClickHandler() {
                    if (status && status.querySelector('.n-base-selection-input[title="Abandon"], .hr-base-selection-input[title="Abandon"]')) {
                        reason.style.display = "block";
                    }
                    else {
                        reason.style.display = "none";
                    }

                    if (status && status.querySelector('.n-base-selection-input[title="Lost"], .hr-base-selection-input[title="Lost"]') ||
                        status && status.querySelector('.n-base-selection-input[title="Abandon"], .hr-base-selection-input[title="Abandon"]')) {
                        internalReview.style.display = "block";
                    }
                    else {
                        internalReview.style.display = "none";
                    }

                    if (reason?.querySelector('.n-base-selection-label, .hr-base-selection-label')?.innerText.includes("Other (note below)")) {
                        notes.style.display = "block";
                    }
                    else {
                        notes.style.display = "none";
                    }

                    if (lostReason?.querySelector('.n-base-selection-label, .hr-base-selection-label')?.innerText.includes("Other (note below in the opportunity card)")) {
                        lostReasonNotes.style.display = "block";
                    }
                    else {
                        lostReasonNotes.style.display = "none";
                    }

                    if (referralSourceDropdown?.querySelector('.n-base-selection-label, .hr-base-selection-label')?.innerText.includes("Former/Current Client")) {
                        formerCurrentClient.style.display = "block";
                    }
                    else {
                        formerCurrentClient.style.display = "none";
                    }

                    if (referralSourceDropdown?.querySelector('.n-base-selection-label, .hr-base-selection-label')?.innerText.includes("Friend")) {
                        friendName.style.display = "block";
                    }
                    else {
                        friendName.style.display = "none";
                    }

                    if (referralSourceDropdown?.querySelector('.n-base-selection-label, .hr-base-selection-label')?.innerText.includes("Another attorney")) {
                        anotherAttorney.style.display = "block";
                    }
                    else {
                        anotherAttorney.style.display = "none";
                    }

                    statusDropdownObserver = new MutationObserver((mutationList) => {
                        statusTypeDropdownSelectedValue = mutationList[0]?.target.innerText;

                        if (mutationList[0]?.target.innerText !== "") {
                            if (status.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")?.innerText.includes("Abandon")) {
                                setTimeout(function () {
                                    reason.querySelector(".n-base-clear__placeholder, .hr-base-clear__placeholder").click();
                                }, 0);

                                setTimeout(function () {
                                    reason.querySelector(".n-base-clear__clear, .hr-base-clear__clear")?.click();
                                }, 0);

                                reason.style.display = "block";
                                internalReview.style.display = "block";
                                lostReasonNotes.style.display = "none";
                                notes.style.display = "none";
                            }
                            else if (status.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")?.innerText.includes("Lost")) {
                                setTimeout(function () {
                                    lostReason.querySelector(".n-base-clear__placeholder, .hr-base-clear__placeholder").click();
                                }, 0);

                                setTimeout(function () {
                                    lostReason.querySelector(".n-base-clear__clear, .hr-base-clear__clear")?.click();
                                }, 0);

                                internalReview.style.display = "block";
                                reason.style.display = "none";
                                notes.style.display = "none";
                                lostReasonNotes.style.display = "none";

                            }
                            else {
                                reason.style.display = "none";
                                lostReasonNotes.style.display = "none";
                                notes.style.display = "none";
                                internalReview.style.display = "none";
                            }
                        }
                    });
                    statusDropdownObserver.observe(document.querySelector("#OpportunityStatus .n-base-selection-label, #OpportunityStatus .hr-base-selection-label"), config);

                    lostReasonDropdownObserver = new MutationObserver((mutationList) => {
                        if (lostReason.querySelector(".n-base-selection-label, .hr-base-selection-label")?.innerText.includes("Other (note below)")) {
                            if (lostReasonNotes.style.display !== "block") {
                                lostReasonNotes.style.display = "block";
                            }
                        }
                        else {
                            if (lostReasonNotes.style.display !== "none") {
                                lostReasonNotes.style.display = "none";
                            }
                        }
                    });
                    lostReasonDropdownObserver.observe(document.querySelector("#select-id .n-base-selection-label, #select-id .hr-base-selection-label"), config);

                    reasonDropdownObserver = new MutationObserver((mutationList) => {
                        if (mutationList[0]?.target.innerText !== "") {
                            if (reason.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")?.innerText.includes("Other (note below)")) {
                                notes.style.display = "block";
                            }
                            else {
                                notes.style.display = "none";
                            }
                        }
                    });
                    reasonDropdownObserver.observe(document.querySelector("#rMQih0k9TxK4zsG3CC1J .n-base-selection-label, #rMQih0k9TxK4zsG3CC1J .hr-base-selection-label"), config);

                    referralSourceDropdownObserver = new MutationObserver((mutationList) => {
                        if (mutationList[0]?.target.innerText !== "") {
                            if (referralSourceDropdown?.querySelector('.n-base-selection-label, .hr-base-selection-label')?.innerText.includes("Former/Current Client")) {
                                formerCurrentClient.style.display = "block";
                            }
                            else {
                                formerCurrentClient.style.display = "none";
                            }

                            if (referralSourceDropdown?.querySelector('.n-base-selection-label, .hr-base-selection-label')?.innerText.includes("Friend")) {
                                friendName.style.display = "block";
                            }
                            else {
                                friendName.style.display = "none";
                            }

                            if (referralSourceDropdown?.querySelector('.n-base-selection-label, .hr-base-selection-label')?.innerText.includes("Another attorney")) {
                                anotherAttorney.style.display = "block";
                            }
                            else {
                                anotherAttorney.style.display = "none";
                            }
                        }
                    });
                    referralSourceDropdownObserver.observe(document.querySelector("#\\33 gIVTJO0inOZUmAADQgc .n-base-selection-label, #\\33 gIVTJO0inOZUmAADQgc .hr-base-selection-label"), config);
                }

                // function referralTabClickHandler() {
                //     referralDivs?.forEach(div => {
                //         if (div.querySelector(".n-form-item-label__text, .hr-form-item-label__text")?.innerText.includes("Referral Partner - " + referralCaseTypeDropdown.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")?.innerText)) {
                //             div.style.display = "block";
                //         }
                //         else {
                //             div.style.display = "none";
                //         }
                //     })

                //     referralCaseTypeDropdownObserver = new MutationObserver((mutationList) => {
                //         referralCaseTypeDropdownSelectedValue = mutationList[0]?.target.innerText;

                //         if (mutationList[0]?.target.innerText !== "") {
                //             referralDivs?.forEach(div => {
                //                 if (div.querySelector(".n-form-item-label__text, .hr-form-item-label__text")?.innerText.includes("Referral Partner - " + referralCaseTypeDropdownSelectedValue)) {
                //                     div.style.display = "block";
                //                 }
                //                 else {
                //                     div.style.display = "none";

                //                     setTimeout(function () {
                //                         div.querySelector(".n-base-clear__placeholder, .hr-base-clear__placeholder").click();
                //                     }, 0);

                //                     setTimeout(function () {
                //                         div.querySelector(".n-base-clear__clear, .hr-base-clear__clear")?.click();
                //                     }, 0);
                //                 }
                //             })
                //         }
                //     });
                //     referralCaseTypeDropdownObserver.observe(document.querySelector("#uuQPykQvEdgXxjG89fBD .n-base-selection-label, #uuQPykQvEdgXxjG89fBD .hr-base-selection-label"), config);
                // }

                function initialScreeningClickHandler() {
                    if (caseEvaluationDropdown && caseEvaluationDropdown.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")?.innerText.includes("Decline")) {
                        reasonRejectionDiv.style.display = "block";
                    }
                    else {
                        reasonRejectionDiv.style.display = "none";
                    }

                    if (reasonRejectionDiv && reasonRejectionDiv.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")?.innerText.includes("Other (note below)")) {
                        RejectionNotesdiv.style.display = "block";
                    }
                    else {
                        RejectionNotesdiv.style.display = "none";
                    }

                    caseEvaluationeDropdownObserver = new MutationObserver((mutationList) => {
                        if (mutationList[0]?.target.innerText !== "") {
                            setTimeout(function () {
                                reasonRejectionDropdown.querySelector(".n-base-clear__placeholder, .hr-base-clear__placeholder").click();
                            }, 0);

                            setTimeout(function () {
                                reasonRejectionDropdown.querySelector(".n-base-clear__clear, .hr-base-clear__clear")?.click();
                            }, 0);

                            if (caseEvaluationDropdown.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")?.innerText.includes("Decline")) {
                                reasonRejectionDiv.style.display = "block";
                            }
                            else {
                                reasonRejectionDiv.style.display = "none";
                                RejectionNotesdiv.style.display = "none";
                            }
                        }
                    });
                    caseEvaluationeDropdownObserver.observe(document.querySelector("#en9d9XLyV1tSlWCsKnI1 .n-base-selection-label, #en9d9XLyV1tSlWCsKnI1 .hr-base-selection-label"), config);

                    reasonRejectionDropdownObserver = new MutationObserver((mutationList) => {
                        if (mutationList[0]?.target.innerText !== "") {
                            if (reasonRejectionDropdown.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")?.innerText.includes("Other (note below)")) {
                                RejectionNotesdiv.style.display = "block";
                            }
                            else {
                                RejectionNotesdiv.style.display = "none";
                            }
                        }
                    });
                    reasonRejectionDropdownObserver.observe(document.querySelector("#bdAZ7TAVuP92KFmCZ3Fd .n-base-selection-label, #bdAZ7TAVuP92KFmCZ3Fd .hr-base-selection-label"), config);
                }

                function agreementSetupClickHandler() {
                    if (contactTypeDropdown && contactTypeDropdown.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")?.innerText.includes("Minor")) {
                        minorsName.style.display = "block";
                        parentName.style.display = "block";
                    }
                    else {
                        minorsName.style.display = "none";
                        parentName.style.display = "none";
                    }

                    if (contactTypeDropdown && contactTypeDropdown.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")?.innerText.includes("Deceased")) {
                        authorizedRepresentative.style.display = "block";
                        deceasedName.style.display = "block";
                    }
                    else {
                        authorizedRepresentative.style.display = "none";
                        deceasedName.style.display = "none";
                    }

                    if (feeTypeDropdown && feeTypeDropdown.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")?.innerText.includes("Blank Fee")) {
                        clientWillPay?.forEach(item => {
                            item.style.display = "block";
                        })
                    }
                    else {
                        clientWillPay?.forEach(item => {
                            item.style.display = "none";
                        })
                    }

                    if (contactTypeDropdown && feeTypeDropdown) {
                        subBlankFeeFields?.forEach(item => {
                            if (item.querySelector(".n-form-item-label__text, .hr-form-item-label__text")?.innerText.includes(`(${contactTypeDropdown.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")?.innerText})`) && feeTypeDropdown.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")?.innerText.includes("Blank Fee")) {
                                item.style.display = "block";
                            }
                            else {
                                item.style.display = "none";
                            }
                        })
                    }

                    if (referralTypeDropdown && referralTypeDropdown.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")?.innerText === "Referral") {
                        attorney.style.display = "block";
                    }
                    else {
                        attorney.style.display = "none";
                    }

                    contactTypeDropdownObserver = new MutationObserver((mutationList) => {
                        if (mutationList[0]?.target.innerText !== "") {
                            if (contactTypeDropdown && contactTypeDropdown.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")?.innerText.includes("Minor")) {
                                minorsName.style.display = "block";
                                parentName.style.display = "block";
                            }
                            else {
                                minorsName.style.display = "none";
                                parentName.style.display = "none";
                            }

                            if (contactTypeDropdown && contactTypeDropdown.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")?.innerText.includes("Deceased")) {
                                authorizedRepresentative.style.display = "block";
                                deceasedName.style.display = "block";
                            }
                            else {
                                authorizedRepresentative.style.display = "none";
                                deceasedName.style.display = "none";
                            }

                            subBlankFeeFields?.forEach(item => {
                                if (item.querySelector(".n-form-item-label__text, .hr-form-item-label__text")?.innerText.includes(`(${contactTypeDropdown.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")?.innerText})`) && feeTypeDropdown.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")?.innerText.includes("Blank Fee")) {
                                    item.style.display = "block";
                                }
                                else {
                                    item.style.display = "none";

                                    setTimeout(function () {
                                        item.querySelector(".n-base-clear__placeholder, .hr-base-clear__placeholder").click();
                                    }, 0);

                                    setTimeout(function () {
                                        item.querySelector(".n-base-clear__clear, .hr-base-clear__clear")?.click();
                                    }, 0);
                                }
                            })
                        }
                    });
                    contactTypeDropdownObserver.observe(document.querySelector("#xPZNYtJ4SoezUTrsc8RU .n-base-selection-label, #xPZNYtJ4SoezUTrsc8RU .hr-base-selection-label"), config);

                    feeTypeDropdownObserver = new MutationObserver((mutationList) => {
                        if (mutationList[0]?.target.innerText !== "") {
                            if (feeTypeDropdown && feeTypeDropdown.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")?.innerText.includes("Blank Fee")) {
                                clientWillPay?.forEach(item => {
                                    item.style.display = "block";
                                })
                            }
                            else {
                                clientWillPay?.forEach(item => {
                                    item.style.display = "none";
                                })
                            }

                            subBlankFeeFields?.forEach(item => {
                                if (item.querySelector(".n-form-item-label__text, .hr-form-item-label__text")?.innerText.includes(`(${contactTypeDropdown.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")?.innerText})`) && feeTypeDropdown.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")?.innerText.includes("Blank Fee")) {
                                    item.style.display = "block";
                                }
                                else {
                                    item.style.display = "none";

                                    setTimeout(function () {
                                        item.querySelector(".n-base-clear__placeholder, .hr-base-clear__placeholder").click();
                                    }, 0);

                                    setTimeout(function () {
                                        item.querySelector(".n-base-clear__clear, .hr-base-clear__clear")?.click();
                                    }, 0);
                                }
                            })
                        }
                    });
                    feeTypeDropdownObserver.observe(document.querySelector("#\\34 g5BbKfiJpqK3YrNkxlQ .n-base-selection-label, #\\34 g5BbKfiJpqK3YrNkxlQ .hr-base-selection-label"), config);

                    referralTypeDropdownObserver = new MutationObserver((mutationList) => {
                        if (mutationList[0]?.target.innerText !== "") {
                            if (referralTypeDropdown && referralTypeDropdown.querySelector(".n-base-selection-input__content, .hr-base-selection-input__content")?.innerText === "Referral") {
                                attorney.style.display = "block";
                            }
                            else {
                                attorney.style.display = "none";
                            }
                        }
                    });
                    referralTypeDropdownObserver.observe(document.querySelector("#\\31 UcJnxQEOlIkXEYVYI9W .n-base-selection-label, #\\31 UcJnxQEOlIkXEYVYI9W .hr-base-selection-label"), config);
                }

                document.querySelectorAll(".wrapperHeader button")?.forEach((button) => {
                    if (button.innerText === "Opportunity Details" && button.classList.contains("bg-blue-50") && !isRunned) {
                        opportunityDetailsClickHandler();
                        isRunned = true;
                    }
                    else if (button.innerText === "Opportunity Details") {
                        button.onclick = opportunityDetailsClickHandler;
                    }
                });

                document.querySelectorAll(".wrapperHeader button")?.forEach((button) => {
                    if (button.innerText === "Referral Tab" && button.classList.contains("bg-blue-50") && !isRunned) {
                        referralTabClickHandler();
                        isRunned = true;
                    }
                    else if (button.innerText === "Referral Tab") {
                        button.onclick = referralTabClickHandler;
                    }
                })

                document.querySelectorAll(".wrapperHeader button")?.forEach((button) => {
                    if (button.innerText === "Initial Screening" && button.classList.contains("bg-blue-50") && !isRunned) {
                        initialScreeningClickHandler();
                        isRunned = true;
                    }
                    else if (button.innerText === "Initial Screening") {
                        button.onclick = initialScreeningClickHandler;
                    }
                })

                document.querySelectorAll(".wrapperHeader button")?.forEach((button) => {
                    if (button.innerText === "Agreement Setup" && button.classList.contains("bg-blue-50") && !isRunned) {
                        agreementSetupClickHandler();
                        isRunned = true;
                    }
                    else if (button.innerText === "Agreement Setup") {
                        button.onclick = agreementSetupClickHandler;
                    }
                })
            }

            observer = new MutationObserver(callback);
            observer.observe(document.body, config);
        }
    }

    function leadAndPdfButtonsObserverFn() {
        let locations = ['Y6NYbsdfpIwPXGM2yBxn', '0OKk2AUg2zJwKTYNwnmf', '0zJVetxLKWFBgyWKbWEm', 'aSuf3rcTIp7BJMAJOwbY', 'Fyky8rCoWF7PbWXBa9ok', 'ks1ttcTX59wuuOzroTRR', 'B01Xwlw7MUoY18oqAELD', 'uQ3PGEfahzk7rpscwzWT'];
        let currentUrl = window.location.href;
        let isLoaction = locations.some(loc => currentUrl.includes(loc));

        console.log("inside the function")
        if (isLoaction && window.location.href.includes("/opportunities/list")) {
            const config = {
                attributes: true,
                childList: true,
                subtree: true
            };
            // attributeFilter: ['id'] 
            const callback = function (mutationsList, observer) {
                mutationsList.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        // console.log("worrrrrkiiiing")
                        // insertLeadBtn()
                        insertPdfBtn()
                    }
                });
            };

            leadAndPdfBtnObserver = new MutationObserver(callback);
            leadAndPdfBtnObserver.observe(document.body, config);
        }
    }


    let formLinks = [
        { locationId: 'Y6NYbsdfpIwPXGM2yBxn', link: 'https://link.infosubmit.co/widget/form/zHTJYyvPktvWb0I8aOdP' }
    ]

    function insertLeadBtn() {
        // console.log("insertLeadBtn")
        const urlPath = window.location.pathname;
        let leadBtnCheck = document.querySelector('.leadBtn')
        let opportunityDiv = document.querySelector("#OpportunitiesList .opportunityPage .pipeline-ribbon > div:nth-child(2)");

        if (!leadBtnCheck && opportunityDiv) {
            formLinks?.forEach((item) => {
                if (urlPath.includes(`${item.locationId}/opportunities`)) {
                    let leadBtnCheck = document.querySelector('.leadBtn')
                    // console.log('iframe insert')
                    // console.log('if condition opportunitydv')
                    let btnSelector = `.${item.locationId} #OpportunitiesList #add-record-btn`
                    console.log(btnSelector)
                    document.querySelector(btnSelector).style.cssText = 'display: none'
                    let newBtn = document.createElement('button')
                    newBtn.textContent = 'Lead'
                    newBtn.classList.add('leadBtn')
                    newBtn.style.cssText = 'border: 1px solid grey; background: #1D2567; color: white; border-radius: 5px; padding: 7px 20px; margin-left: 5px'
                    opportunityDiv.appendChild(newBtn)

                    const opportunitiesFormPopupContainer = document.createElement("div");
                    opportunitiesFormPopupContainer.classList.add('opportunitiesFormPopupContainer')
                    const opportunitiesFormPopup = document.createElement("div");
                    opportunitiesFormPopup.classList.add("opportunitiesFormPopup");
                    opportunitiesFormPopupContainer.style.display = "none";

                    let closeBtnDiv = document.createElement('div')
                    let closeBtn = document.createElement('span');
                    closeBtn.id = 'closeopportunitiesFormPopup';
                    closeBtnDiv.style.cssText = 'padding:15px; text-align: end; font-size:20px; font-weight:bold; cursor:pointer; background:white';
                    closeBtn.innerHTML = '&#x2715;';
                    closeBtnDiv.appendChild(closeBtn)
                    opportunitiesFormPopup.appendChild(closeBtnDiv)

                    const iframe = document.createElement("iframe");
                    iframe.src = item.link;
                    iframe.classList.add("opportunitiesFormPopup-iframe");

                    closeBtn.addEventListener("click", function () {
                        if (iframe) {
                            iframe.src = item.link;
                        }
                        if (opportunitiesFormPopupContainer.style.display === "none") {
                            opportunitiesFormPopupContainer.style.display = "flex";
                            opportunitiesFormPopup.style.top = newBtn.getBoundingClientRect().bottom + "px";
                            opportunitiesFormPopup.style.left = newBtn.getBoundingClientRect().left + "px";
                            // newBtn.remove()
                            // insertLeadBtn()
                        }
                    });

                    newBtn.addEventListener("click", function () {
                        if (opportunitiesFormPopupContainer.style.display === "none") {
                            opportunitiesFormPopupContainer.style.display = "flex";
                            opportunitiesFormPopup.style.top = newBtn.getBoundingClientRect().bottom + "px";
                            opportunitiesFormPopup.style.left = newBtn.getBoundingClientRect().left + "px";
                            // iframe.src = item.link;
                        }
                    });


                    opportunitiesFormPopup.appendChild(iframe);
                    opportunitiesFormPopupContainer.appendChild(opportunitiesFormPopup);
                    document.body.appendChild(opportunitiesFormPopupContainer);
                    opportunitiesFormPopupContainer.addEventListener('click', () => {
                        if (iframe) {
                            iframe.src = item.link;
                        }
                        opportunitiesFormPopupContainer.style.display = 'none'
                        // newBtn.remove()
                        // insertLeadBtn()
                    })

                }
            })
        }

    }

    let pdfLinks = [
        { locationId: '0OKk2AUg2zJwKTYNwnmf' },
        { locationId: '0zJVetxLKWFBgyWKbWEm' },
        { locationId: 'aSuf3rcTIp7BJMAJOwbY' },
        { locationId: 'Fyky8rCoWF7PbWXBa9ok' },
        { locationId: 'ks1ttcTX59wuuOzroTRR' },
        { locationId: 'B01Xwlw7MUoY18oqAELD' },
        { locationId: 'uQ3PGEfahzk7rpscwzWT' },
    ]

    function insertPdfBtn() {
        const urlPath = window.location.pathname;
        let pdfBtnCheck = document.querySelector('.pdfBtn')
        let opportunityContainer = document.querySelector("#OpportunitiesList .opportunityPage .pipeline-ribbon > div:nth-child(2)")

        if (!pdfBtnCheck && opportunityContainer) {
            pdfLinks?.forEach((item) => {
                if (urlPath.includes(`${item.locationId}/opportunities`)) {
                    // console.log('iframe insert')
                    let newBtn = document.createElement('button')
                    newBtn.textContent = 'PDF'
                    newBtn.classList.add('pdfBtn')
                    newBtn.style.cssText = 'border: 1px solid grey; background: #1D2567; color: white; border-radius: 5px; padding: 7px 20px; margin-left: 5px'
                    opportunityContainer.appendChild(newBtn)

                    const opportunitiesPdfPopupContainer = document.createElement("div");
                    opportunitiesPdfPopupContainer.classList.add('opportunitiesPdfPopupContainer')
                    const opportunitiesPdfPopup = document.createElement("div");
                    opportunitiesPdfPopup.classList.add("opportunitiesPdfPopup");
                    opportunitiesPdfPopupContainer.style.display = "none";

                    let closeBtnDiv = document.createElement('div')
                    let closeBtn = document.createElement('span');
                    closeBtn.id = 'closeopportunitiesPdfPopup';
                    closeBtnDiv.style.cssText = 'padding:15px; text-align: end; font-size:20px; font-weight:bold; cursor:pointer; background:white';
                    closeBtn.innerHTML = '&#x2715;';
                    closeBtnDiv.appendChild(closeBtn)
                    opportunitiesPdfPopup.appendChild(closeBtnDiv)

                    const iframe = document.createElement("iframe");
                    // iframe.src = `https://main.d2604xi44ces64.amplifyapp.com/k1F38z3A0efRMHeVkk3v`;
                    iframe.src = `https://main.d2604xi44ces64.amplifyapp.com/${item.locationId}`;
                    iframe.classList.add("opportunitiesPdfPopup-iframe");

                    closeBtn.addEventListener("click", function () {
                        if (iframe) {
                            iframe.src = `https://main.d2604xi44ces64.amplifyapp.com/${item.locationId}`;
                        }
                        console.log("iframe.src")
                        if (opportunitiesPdfPopupContainer.style.display === "none") {
                            opportunitiesPdfPopupContainer.style.display = "flex";
                            opportunitiesPdfPopup.style.top = newBtn.getBoundingClientRect().bottom + "px";
                            opportunitiesPdfPopup.style.left = newBtn.getBoundingClientRect().left + "px";
                        }
                    });

                    newBtn.addEventListener("click", function () {
                        if (opportunitiesPdfPopupContainer.style.display === "none") {
                            opportunitiesPdfPopupContainer.style.display = "flex";
                            opportunitiesPdfPopup.style.top = newBtn.getBoundingClientRect().bottom + "px";
                            opportunitiesPdfPopup.style.left = newBtn.getBoundingClientRect().left + "px";
                        }
                    });


                    opportunitiesPdfPopup.appendChild(iframe);
                    opportunitiesPdfPopupContainer.appendChild(opportunitiesPdfPopup);
                    document.body.appendChild(opportunitiesPdfPopupContainer);
                    opportunitiesPdfPopupContainer.addEventListener('click', () => {
                        if (iframe) {
                            iframe.src = `https://main.d2604xi44ces64.amplifyapp.com/${item.locationId}`;
                        }
                        opportunitiesPdfPopupContainer.style.display = 'none'
                    })

                }
            })
        }

    }

    let previousOpportunityTab = ""
    let retainerNo = 0
    let shumanRetainerNo = 0
    let trumanRetainerNo = 0

    function observerOpportunityTabFn() {
        if (window.location.href.includes("/v2/location/ajxLvQpiXxVPc2LO9SBH/opportunities/list/") || window.location.href.includes("/v2/location/0zJVetxLKWFBgyWKbWEm/opportunities/list/")
            || window.location.href.includes("/v2/location/ks1ttcTX59wuuOzroTRR/opportunities/list/") || window.location.href.includes("/v2/location/B01Xwlw7MUoY18oqAELD/opportunities/list/")) {
            let urlParams = new URLSearchParams(window.location.search)
            let opportunityTab = urlParams.get("tab")
            if (opportunityTab) {

                const config = {
                    attributes: true,
                    childList: true,
                    subtree: true
                };
                // attributeFilter: ['id'] 
                const callback = function (mutationsList, observer) {
                    mutationsList.forEach((mutation) => {
                        let urlParams = new URLSearchParams(window.location.search)
                        let opportunityTab = urlParams.get("tab")
                        // if (mutation.type === 'childList') {
                        if (opportunityTab === "Opportunity Details") {
                            let emailPhoneTypeOrderAdded = document.querySelector(".emailPhoneTypeOrderAdded")
                            if (!emailPhoneTypeOrderAdded) {
                                // emailPhoneTypeFieldOrderFn()
                            }
                            let abandonReasonField = document.querySelector(".abandonReasonField")
                            let OpportunityStatus = document.querySelector("#OpportunityStatus")
                            if (abandonReasonField) {
                                if (OpportunityStatus?.textContent === "Abandon") {
                                    abandonReasonField.style.display = "block"
                                } else {
                                    abandonReasonField.style.display = "none"
                                }
                            }
                        }

                        if (opportunityTab === "Agreement Set up") {
                            let revocableOrderAdded = document.querySelector(".revocableField")
                            if (!revocableOrderAdded) {
                                agreementOrderSetUpFn()
                            }
                        }

                        setTimeout(() => {

                            let retainersNumberElem = document.querySelector("#v3259NfcsQaoQixaxvGs");
                            if (retainersNumberElem) {
                                documentSetupAgreementFn()
                            }

                            let shumanRetainersNumberElem = document.querySelector("#suzGJV0WaUfInsOTFpTr");
                            if (shumanRetainersNumberElem) {
                                shumanAgreementSetupAgreementFn()
                            }

                            let trumanRetainersNumberElem = document.querySelector("#h9uQmhAuFYk6TpfCps9K");
                            if (trumanRetainersNumberElem) {
                                trumanAgreementSetupAgreementFn()
                            }

                            let urlParams = new URLSearchParams(window.location.search)
                            let opportunityTab = urlParams.get("tab")
                            if (opportunityTab === "Document Set Up") {
                                // console.log("opportunityTab", opportunityTab)
                                let minorNameElem = document.querySelector(`.minorNameElem-1`)
                                if (!minorNameElem) {
                                    [1, 2, 3, 4, 5, 6].map((agreementNo) => {
                                        documentOrderSetupAgreementFn(agreementNo)
                                    })
                                }

                            } else if (opportunityTab === "Agreement Set Up") {
                                // console.log("opportunityTab", opportunityTab)
                                let minorFullNameElem = document.querySelector(`.minorFullNameElem-1`)
                                if (!minorFullNameElem) {
                                    [1, 2, 3, 4, 5].map((agreementNo) => {
                                        shumanOrderAgreeementSetupFn(agreementNo)
                                    })
                                }

                            } else if (opportunityTab === "Document Set Up") {
                                let allRetainerHeadingAdded = document.querySelector(".allRetainerHeadingAdded")
                                let label = document.querySelector(`[placeholder="Lead Full Name"]`)
                                // console.log(label.textContent)

                                if (label?.parentElement && label.parentElement.textContent.includes("Lead Full Name") && !allRetainerHeadingAdded) {
                                    const container = label?.parentElement.closest(".hr-form-item")?.parentElement;
                                    console.log(container);
                                    const heading = document.createElement("div");
                                    heading.textContent = `Fields for All retainers`;
                                    heading.classList.add("allRetainerHeadingAdded")
                                    heading.style.cssText = "font-size:1.2rem; margin-bottom:10px; font-weight:bold;";
                                    container.insertBefore(heading, container.firstChild);
                                }
                            }
                        }, 0);


                        // }

                        if (opportunityTab === "Agreement Set up") {
                            // console.log(mutation.target?.textContent.trim());
                            if (mutation.target?.parentElement?.textContent?.trim() === "Revocable Trust(s):") {
                                // console.log("checked Revocable Trust(s):")
                                let revocableField = document.querySelector(".revocableField")
                                if (mutation.target.getAttribute("aria-checked") === "true") {
                                    revocableField.style.display = "block"
                                    revocableField.style.marginBottom = "10px"
                                } else {
                                    revocableField.style.display = "none"
                                }

                            } else if (mutation.target?.parentElement?.textContent?.trim() === "Irrevocable Trust(s):") {
                                // console.log("checked Irrevocable Trust(s):")
                                let irrevocableField = document.querySelector(".irrevocableField")
                                if (mutation.target.getAttribute("aria-checked") === "true") {
                                    irrevocableField.style.display = "block"
                                    irrevocableField.style.marginBottom = "10px"
                                } else {
                                    irrevocableField.style.display = "none"
                                }
                            } else if (mutation.target?.parentElement?.textContent?.trim() === "# of properties") {
                                // console.log("checked # of properties")
                                let propertiesField = document.querySelector(".propertiesField")
                                if (mutation.target.getAttribute("aria-checked") === "true") {
                                    propertiesField.style.display = "block"
                                    propertiesField.style.marginBottom = "10px"
                                } else {
                                    propertiesField.style.display = "none"
                                }
                            }


                        }

                        let shumanRetainersNumberElem = document.querySelector("#suzGJV0WaUfInsOTFpTr");
                        if (opportunityTab === "Agreement Set Up") {
                            if (shumanRetainersNumberElem) {
                                if (window.location.href.includes("/v2/location/ks1ttcTX59wuuOzroTRR/opportunities/list/")) {
                                    if (mutation.target.closest(".hr-form-item")?.textContent.includes("Which agreement do you wish to send")) {
                                        if (opportunityTab !== previousOpportunityTab) {
                                            setTimeout(() => {
                                                shumanCheckBoxChangeFn()

                                            }, 0)
                                        } else {
                                            shumanCheckBoxChangeFn()
                                        }
                                        // console.log(mutation.target?.textContent.trim());
                                    }
                                }
                            }
                        } else {
                            shumanRetainerNo = 0
                            trumanRetainerNo = 0
                        }

                        //Document Set Up
                        if (opportunityTab === "Document Set Up") {
                            if (mutation.target.closest(".hr-form-item")?.textContent.includes("Which agreement do you wish to send")) {
                                // console.log(mutation.target?.textContent.trim());
                                [1, 2, 3, 4, 5, 6].forEach((agreementNo) => {

                                    let minorNameCheckbox = document.querySelector(`.minorNameCheckbox-${agreementNo} [role="checkbox"]`)
                                    let previousOfferCheckbox = document.querySelector(`.previousOfferCheckbox-${agreementNo} [role="checkbox"]`)
                                    let blackJonesCheckbox = document.querySelector(`.blackJonesCheckbox-${agreementNo} [role="checkbox"]`)
                                    let coCouncelRetainerCheckbox = document.querySelector(`.coCouncelRetainerCheckbox-${agreementNo} [role="checkbox"]`)
                                    let coCouncelMinorCheckbox = document.querySelector(`.coCouncelMinorCheckbox-${agreementNo} [role="checkbox"]`)
                                    let conflictWaiverEngCheckbox = document.querySelector(`.conflictWaiverEngCheckbox-${agreementNo} [role="checkbox"]`)
                                    let conflictWaiverSpaCheckbox = document.querySelector(`.conflictWaiverSpaCheckbox-${agreementNo} [role="checkbox"]`)

                                    if (minorNameCheckbox) {
                                        let minorNameElem = document.querySelector(`.minorNameElem-${agreementNo}`)
                                        if (minorNameCheckbox.getAttribute("aria-checked") === "true") {
                                            minorNameElem.style.display = "block"
                                            minorNameElem.style.marginBottom = "10px"
                                        } else {
                                            minorNameElem.style.display = "none"
                                        }

                                    }

                                    if (previousOfferCheckbox) {
                                        let offerElem = document.querySelector(`.offerElem-${agreementNo}`)
                                        if (previousOfferCheckbox.getAttribute("aria-checked") === "true") {
                                            offerElem.style.display = "block"
                                            offerElem.style.marginBottom = "10px"
                                        } else {
                                            offerElem.style.display = "none"
                                        }

                                    }
                                    if (blackJonesCheckbox) {
                                        let blackJonesAttorneyNameElem = document.querySelector(`.blackJonesAttorneyNameElem-${agreementNo}`)
                                        // let blackJonesEmailToElem = document.querySelector(`.blackJonesEmailToElem-${agreementNo}`)

                                        if (blackJonesCheckbox.getAttribute("aria-checked") === "true") {
                                            blackJonesAttorneyNameElem.style.display = "block"
                                            blackJonesAttorneyNameElem.style.marginBottom = "10px"
                                            // blackJonesEmailToElem.style.display = "block"
                                            // blackJonesEmailToElem.style.marginBottom = "10px"
                                        } else {
                                            blackJonesAttorneyNameElem.style.display = "none"
                                            // blackJonesEmailToElem.style.display = "none"
                                        }
                                    }
                                    if (coCouncelRetainerCheckbox) {
                                        let coCouncelAttorneyNameElem = document.querySelector(`.coCouncelAttorneyNameElem-${agreementNo}`)
                                        // let coCouncelEmailToElem = document.querySelector(`.coCouncelEmailToElem-${agreementNo}`)

                                        if (coCouncelRetainerCheckbox.getAttribute("aria-checked") === "true") {
                                            coCouncelAttorneyNameElem.style.display = "block"
                                            coCouncelAttorneyNameElem.style.marginBottom = "10px"
                                            // coCouncelEmailToElem.style.display = "block"
                                            // coCouncelEmailToElem.style.marginBottom = "10px"
                                        } else {
                                            coCouncelAttorneyNameElem.style.display = "none"
                                            // coCouncelEmailToElem.style.display = "none"
                                        }
                                    }

                                    if (coCouncelMinorCheckbox) {
                                        let coCouncelMinorNameElem = document.querySelector(`.coCouncelMinorNameElem-${agreementNo}`)
                                        let coCouncelMinorAttorneyElem = document.querySelector(`.coCouncelMinorAttorneyElem-${agreementNo}`)
                                        // let coCouncelMinorEmailToElem = document.querySelector(`.coCouncelMinorEmailToElem-${agreementNo}`)

                                        if (coCouncelMinorCheckbox.getAttribute("aria-checked") === "true") {
                                            coCouncelMinorNameElem.style.display = "block"
                                            coCouncelMinorNameElem.style.marginBottom = "10px"
                                            coCouncelMinorAttorneyElem.style.display = "block"
                                            coCouncelMinorAttorneyElem.style.marginBottom = "10px"
                                            // coCouncelMinorEmailToElem.style.display = "block"
                                            // coCouncelMinorEmailToElem.style.marginBottom = "10px"
                                        } else {
                                            coCouncelMinorNameElem.style.display = "none"
                                            coCouncelMinorAttorneyElem.style.display = "none"
                                            // coCouncelMinorEmailToElem.style.display = "none"
                                        }
                                    }
                                    if (conflictWaiverEngCheckbox) {
                                        let conflictWaivedEngElem = document.querySelector(`.conflictWaivedEngElem-${agreementNo}`)
                                        let conflictLocationEngElem = document.querySelector(`.conflictLocationEngElem-${agreementNo}`)

                                        if (conflictWaiverEngCheckbox.getAttribute("aria-checked") === "true") {
                                            conflictWaivedEngElem.style.display = "block"
                                            conflictWaivedEngElem.style.marginBottom = "10px"
                                            conflictLocationEngElem.style.display = "block"
                                            conflictLocationEngElem.style.marginBottom = "10px"
                                        } else {
                                            conflictWaivedEngElem.style.display = "none"
                                            conflictLocationEngElem.style.display = "none"
                                        }
                                    }
                                    if (conflictWaiverSpaCheckbox) {
                                        let conflictWaivedSpaElem = document.querySelector(`.conflictWaivedSpaElem-${agreementNo}`)
                                        let conflictLocationSpaElem = document.querySelector(`.conflictLocationSpaElem-${agreementNo}`)

                                        if (conflictWaiverSpaCheckbox.getAttribute("aria-checked") === "true") {
                                            conflictWaivedSpaElem.style.display = "block"
                                            conflictWaivedSpaElem.style.marginBottom = "10px"
                                            conflictLocationSpaElem.style.display = "block"
                                            conflictLocationSpaElem.style.marginBottom = "10px"
                                        } else {
                                            conflictWaivedSpaElem.style.display = "none"
                                            conflictLocationSpaElem.style.display = "none"
                                        }
                                    }

                                })
                            }
                        } else {
                            retainerNo = 0
                        }
                        setTimeout(() => {
                            previousOpportunityTab = opportunityTab
                        }, 0);

                        // if (window.location.href.includes("/v2/location/0zJVetxLKWFBgyWKbWEm/")) {
                        //     insertIntakeReportBtn()
                        // }
                    });
                };

                opportunityTabObserver = new MutationObserver(callback);
                opportunityTabObserver.observe(document.body, config);

            }
        }
    }

    async function insertIntakeReportBtn() {
        let intakeReportBtnAdded = document.querySelector('.intakeReportBtnAdded')
        let opportunityHeaderContainer = document.querySelector(".ui-modal-heading .title")
        let locationId = getLocationId()

        if (!intakeReportBtnAdded && opportunityHeaderContainer && locationId === "0zJVetxLKWFBgyWKbWEm") {
            // if (!isOnboardLocationChecked) {
            //     let locationId = getLocationId()
            //     let response = await intakeReportApi(`check-location/${locationId}/`)
            //     isOnboardLocationChecked = true
            //     isNewLocationOnboard = response.onboarded
            // }
            let newBtn = document.createElement('button')
            newBtn.textContent = 'Intake Report'
            newBtn.classList.add('intakeReportBtnAdded')
            newBtn.style.cssText = 'border: 1px solid grey; background: #1D2567; color: white; border-radius: 5px; padding: 0px 10px; margin-left: 5px'
            opportunityHeaderContainer.insertBefore(newBtn, opportunityHeaderContainer.children[0] || null)

            newBtn.addEventListener("click", async function (e) {
                let opportunityIdElem = document.querySelector(".hr-card__content .wrapper > div > div:nth-child(2) > div div:nth-child(3) span span")
                let opportunityId = opportunityIdElem ? opportunityIdElem.textContent : ""
                e.target.innerHTML = `<div class="button-spinner"></div> Creating PDF...`;
                // let payloadData =
                // {
                //     "id": opportunityId,
                //     "contact_id": "MNYme0LKCAK6IUWrI8VB",
                //     "location": { "id": locationId }
                // }
                let locationId = getLocationId()
                let viewBtn = document.createElement('button')
                try {
                    let responseData = await intakeReportApi(`locations/${locationId}/opportunities/${opportunityId}/pdf/`, "POST")
                    console.log("responseData---", responseData)
                    if (!responseData.error) {
                        viewBtn.textContent = 'View Report Pdf'
                        viewBtn.classList.add('intakeReportBtnAdded')
                        viewBtn.style.cssText = 'border: 1px solid grey; background: #155EEE; color: white; border-radius: 5px; padding: 0px 10px; margin-left: 5px'
                        viewBtn.addEventListener("click", () => {
                            window.open(responseData.pdf_url, '_blank')
                        })
                    } else {
                        viewBtn.textContent = 'Something went wrong..'
                        viewBtn.classList.add('intakeReportBtnAdded')
                        viewBtn.style.cssText = 'border: 1px solid grey; background: red; color: white; border-radius: 5px; padding: 0px 10px; margin-left: 5px'
                    }
                } catch (error) {
                    viewBtn.textContent = 'Something went wrong..'
                    viewBtn.classList.add('intakeReportBtnAdded')
                    viewBtn.style.cssText = 'border: 1px solid grey; background: red; color: white; border-radius: 5px; padding: 0px 10px; margin-left: 5px'
                }
                e.target.replaceWith(viewBtn);
            });

        }
    }

    async function intakeReportApi(uri, method = "GET", data = null) {
        try {
            const response = await fetch("https://intakepdf.lawfirmgrowthmachine.com/" + uri, {
                method,
                body: data ? JSON.stringify(data) : null,
            });

            const text = await response.text();
            return JSON.parse(text);
        } catch (error) {
            console.error("API Call Error:", error);
            throw error;
        }
    }

    function shumanCheckBoxChangeFn() {
        [1, 2, 3, 4, 5].forEach((agreementNo) => {
            let minorPiCheckbox = document.querySelector(`.minorPiCheckbox-${agreementNo} [role="checkbox"]`)
            let pidCheckbox = document.querySelector(`.pidCheckbox-${agreementNo} [role="checkbox"]`)
            let piMedicareCheckbox = document.querySelector(`.piMedicareCheckbox-${agreementNo} [role="checkbox"]`)
            let wcdCheckbox = document.querySelector(`.wcdCheckbox-${agreementNo} [role="checkbox"]`)
            let wcdAtticusCheckbox = document.querySelector(`.wcdAtticusCheckbox-${agreementNo} [role="checkbox"]`)

            if (minorPiCheckbox) {
                let minorFullNameElem = document.querySelector(`.minorFullNameElem-${agreementNo}`)
                let minorDOBElem = document.querySelector(`.minorDOBElem-${agreementNo}`)

                if (minorPiCheckbox.getAttribute("aria-checked") === "true") {
                    minorFullNameElem.style.display = "block"
                    minorFullNameElem.style.marginBottom = "10px"
                    minorDOBElem.style.display = "block"
                    minorDOBElem.style.marginBottom = "10px"
                } else {
                    minorFullNameElem.style.display = "none"
                    minorDOBElem.style.display = "none"
                }
            }

            if (pidCheckbox) {
                let pidFullNameElem = document.querySelector(`.pidFullNameElem-${agreementNo}`)
                let pidDOBElem = document.querySelector(`.pidDOBElem-${agreementNo}`)
                let pidSSNElem = document.querySelector(`.pidSSNElem-${agreementNo}`)
                let pidDODElem = document.querySelector(`.pidDODElem-${agreementNo}`)

                if (pidCheckbox.getAttribute("aria-checked") === "true") {
                    pidFullNameElem.style.display = "block"
                    pidFullNameElem.style.marginBottom = "10px"
                    pidDOBElem.style.display = "block"
                    pidDOBElem.style.marginBottom = "10px"
                    pidSSNElem.style.display = "block"
                    pidSSNElem.style.marginBottom = "10px"
                    pidDODElem.style.display = "block"
                    pidDODElem.style.marginBottom = "10px"
                } else {
                    pidFullNameElem.style.display = "none"
                    pidDOBElem.style.display = "none"
                    pidSSNElem.style.display = "none"
                    pidDODElem.style.display = "none"
                }
            }

            if (piMedicareCheckbox) {
                let beneficiaryNameElem = document.querySelector(`.beneficiaryNameElem-${agreementNo}`)
                let numOnMedicareCardElem = document.querySelector(`.numOnMedicareCardElem-${agreementNo}`)
                let dateOfInjuryElem = document.querySelector(`.dateOfInjuryElem-${agreementNo}`)

                if (piMedicareCheckbox.getAttribute("aria-checked") === "true") {
                    beneficiaryNameElem.style.display = "block"
                    beneficiaryNameElem.style.marginBottom = "10px"
                    numOnMedicareCardElem.style.display = "block"
                    numOnMedicareCardElem.style.marginBottom = "10px"
                    dateOfInjuryElem.style.display = "block"
                    dateOfInjuryElem.style.marginBottom = "10px"
                } else {
                    beneficiaryNameElem.style.display = "none"
                    numOnMedicareCardElem.style.display = "none"
                    dateOfInjuryElem.style.display = "none"
                }
            }

            if (wcdCheckbox) {
                let wcdFullNameElem = document.querySelector(`.wcdFullNameElem-${agreementNo}`)
                let wcdDOBElem = document.querySelector(`.wcdDOBElem-${agreementNo}`)
                let wcdSSNElem = document.querySelector(`.wcdSSNElem-${agreementNo}`)
                let wcdDODElem = document.querySelector(`.wcdDODElem-${agreementNo}`)

                if (wcdCheckbox.getAttribute("aria-checked") === "true") {
                    wcdFullNameElem.style.display = "block"
                    wcdFullNameElem.style.marginBottom = "10px"
                    wcdDOBElem.style.display = "block"
                    wcdDOBElem.style.marginBottom = "10px"
                    wcdSSNElem.style.display = "block"
                    wcdSSNElem.style.marginBottom = "10px"
                    wcdDODElem.style.display = "block"
                    wcdDODElem.style.marginBottom = "10px"
                } else {
                    wcdFullNameElem.style.display = "none"
                    wcdDOBElem.style.display = "none"
                    wcdSSNElem.style.display = "none"
                    wcdDODElem.style.display = "none"
                }
            }

            if (wcdAtticusCheckbox) {
                let wcdAtticusFullNameElem = document.querySelector(`.wcdAtticusFullNameElem-${agreementNo}`)
                let wcdAtticusDOBElem = document.querySelector(`.wcdAtticusDOBElem-${agreementNo}`)
                let wcdAtticusSSNElem = document.querySelector(`.wcdAtticusSSNElem-${agreementNo}`)
                let wcdAtticusDODElem = document.querySelector(`.wcdAtticusDODElem-${agreementNo}`)

                if (wcdAtticusCheckbox.getAttribute("aria-checked") === "true") {
                    wcdAtticusFullNameElem.style.display = "block"
                    wcdAtticusFullNameElem.style.marginBottom = "10px"
                    wcdAtticusDOBElem.style.display = "block"
                    wcdAtticusDOBElem.style.marginBottom = "10px"
                    wcdAtticusSSNElem.style.display = "block"
                    wcdAtticusSSNElem.style.marginBottom = "10px"
                    wcdAtticusDODElem.style.display = "block"
                    wcdAtticusDODElem.style.marginBottom = "10px"
                } else {
                    wcdAtticusFullNameElem.style.display = "none"
                    wcdAtticusDOBElem.style.display = "none"
                    wcdAtticusSSNElem.style.display = "none"
                    wcdAtticusDODElem.style.display = "none"
                }
            }

        })
    }
    // function emailPhoneTypeFieldOrderFn() {
    //     let opportunityFormContainer = document.querySelector("#opportunitiesForm:nth-child(2) > div")
    //     if (opportunityFormContainer) {
    //         opportunityFormContainer.style.cssText = "display: flex; flex-direction: column"
    //         opportunityFormContainer.classList.add("emailPhoneTypeOrderAdded")

    //         let opportunitiesFields = document.querySelectorAll("#opportunitiesForm:nth-child(2) > div > div")

    //         opportunitiesFields?.forEach((field, index) => {
    //             if (opportunitiesFields.length == index + 1) {
    //                 field.style.order = 2
    //             } else if (opportunitiesFields.length - 1 == index + 1) {
    //                 field.style.order = 1
    //             } else if (opportunitiesFields.length - 1 == index + 2) {
    //                 field.style.order = 7
    //                 field.classList.add("abandonReasonField")
    //             } else {
    //                 field.style.order = index + 3
    //             }
    //         })
    //     }
    // }


    function documentSetupAgreementFn() {
        const labels = document.querySelectorAll(".hr-form-item-label");
        const retainersNumber = document.querySelector("#v3259NfcsQaoQixaxvGs");
        const maxRetainers = parseInt(retainersNumber.textContent);

        let headingsAdded = document.querySelector(".headingsAdded")

        if (maxRetainers !== retainerNo) {

            labels.forEach(label => {
                const container = label.closest(".hr-form-item");
                const text = label.textContent;

                if (text !== "How many retainers do you need to set up?") {
                    const match = text.match(/\d+/);
                    const agreementNo = match ? parseInt(match[0]) : null;

                    if (!headingsAdded) {
                        if (text.includes(`Is the new client an adult or minor? ${agreementNo}`)) {
                            const heading = document.createElement("div");
                            heading.textContent = `Agreement- ${agreementNo}`;
                            heading.style.cssText = "font-size:1.2rem; margin-bottom:10px; font-weight:bold;";
                            container.insertBefore(heading, container.firstChild);
                        }
                    }

                    if (text.includes("Is MacClokeyKesler representing alone or with co-counsel")) {
                        let parentElem = label.parentElement
                        const allLabels = document.querySelectorAll(".hr-form-item-label");
                        if (parentElem.querySelector(`[title="MacCloskeyKesler + Co-Cousel"]`)) {
                            allLabels.forEach((item) => {
                                if (item.textContent.includes(`Co-Counsel Firm/Attorney`) && item.textContent.includes(agreementNo)) {
                                    item.parentElement.parentElement.style.display = "block"
                                }
                            })
                        } else {
                            allLabels.forEach((item) => {
                                if (item.textContent.includes(`Co-Counsel Firm/Attorney`) && item.textContent.includes(agreementNo)) {
                                    item.parentElement.parentElement.style.display = "none"
                                }
                            })
                        }
                    }

                    if (agreementNo && agreementNo <= maxRetainers) {
                        container.style.display = "block";
                    } else if (text.includes(agreementNo)) {
                        container.style.display = "none";
                    }
                    // documentOrderSetupAgreementFn(agreementNo)
                    /////////////////////////////////////////////

                    ////////////////////////////////////////
                }
            });
            if (!headingsAdded) {
                retainersNumber.classList.add("headingsAdded");
            }
        }
        retainerNo = maxRetainers

    }

    function shumanAgreementSetupAgreementFn() {
        const labels = document.querySelectorAll(".hr-form-item-label");
        const retainersNumber = document.querySelector("#suzGJV0WaUfInsOTFpTr");
        const maxRetainers = parseInt(retainersNumber.textContent);

        let headingsAdded = document.querySelector(".headingsAdded")

        if (maxRetainers !== shumanRetainerNo) {

            labels.forEach(label => {
                const container = label.closest(".hr-form-item");
                const text = label.textContent;

                if (text !== "How many retainers do you need to set up?") {
                    const match = text.match(/\d+/);
                    const agreementNo = match ? parseInt(match[0]) : null;

                    if (agreementNo && agreementNo <= maxRetainers) {
                        container.style.display = "block";
                    } else if (text.includes(agreementNo)) {
                        container.style.display = "none";
                    }
                }
            });
            if (!headingsAdded) {
                retainersNumber.classList.add("headingsAdded");
            }
        }
        shumanRetainerNo = maxRetainers
    }

    function trumanAgreementSetupAgreementFn() {
        const labels = document.querySelectorAll(".hr-form-item-label");
        const retainersNumber = document.querySelector("#h9uQmhAuFYk6TpfCps9K");
        const maxRetainers = parseInt(retainersNumber.textContent);

        let headingsAdded = document.querySelector(".headingsAdded")

        if (maxRetainers !== trumanRetainerNo) {

            labels.forEach(label => {
                const container = label.closest(".hr-form-item");
                const text = label.textContent;

                if (text !== "How many retainers do you need to set up?") {
                    const match = text.match(/\d+/);
                    const agreementNo = match ? parseInt(match[0]) : null;

                    if (!headingsAdded) {
                        if (text.includes(`Which agreement do you wish to send?-${agreementNo}`)) {
                            const heading = document.createElement("div");
                            heading.textContent = `Agreement- ${agreementNo}`;
                            heading.style.cssText = "font-size:1.2rem; margin-bottom:10px; font-weight:bold;";
                            container.insertBefore(heading, container.firstChild);
                        }
                    }

                    if (agreementNo && agreementNo <= maxRetainers) {
                        container.style.display = "block";
                    } else if (text.includes(agreementNo)) {
                        container.style.display = "none";
                    }
                }
            });
            if (!headingsAdded) {
                retainersNumber.classList.add("headingsAdded");
            }
        }
        trumanRetainerNo = maxRetainers
    }

    function shumanOrderAgreeementSetupFn(agreementNo) {
        let labels = document.querySelectorAll(".hr-form-item-label");
        // console.log("documentOrderSetupAgreementFn", agreementNo);

        labels?.forEach((label) => {

            const container = label.closest(".hr-form-item");
            // if (!headingsAdded) {
            if (label.textContent.includes(`Which agreement do you wish to send ${agreementNo}`)) {
                console.log("agreementNo name");
                const heading = document.createElement("div");
                heading.textContent = `Agreement- ${agreementNo}`;
                heading.style.cssText = "font-size:1.2rem; margin-bottom:10px; font-weight:bold;";
                container.insertBefore(heading, container.firstChild);
            }
            // }

            if ((label.textContent.includes("Minor Full Name") || label.textContent.includes("Minor DOB")) && label.textContent.includes(agreementNo)) {
                label.style.display = "none"
                let piMinorElem = label.parentElement
                piMinorElem.querySelector(".hr-form-item-feedback-wrapper").style.display = "none"
                piMinorElem.style.gridTemplateRows = "auto"
                // console.log(label)
                piMinorElem.style.display = "none";
                if (label.textContent.includes("Minor Full Name")) {
                    piMinorElem.classList.add(`minorFullNameElem-${agreementNo}`)
                } else if (label.textContent.includes("Minor DOB")) {
                    piMinorElem.classList.add(`minorDOBElem-${agreementNo}`)
                }

                labels.forEach((label) => {
                    if (label.textContent.includes(agreementNo)) {
                        // console.log("label", label)
                        let wishToSendElem = label.parentElement
                        let checkBoxesContainer = wishToSendElem.querySelector(`[test-data-type="CHECKBOX"]`)
                        let checkBoxes = wishToSendElem.querySelectorAll(`[test-data-type="CHECKBOX"] > div`)
                        checkBoxes.forEach((box, index) => {
                            if (box.textContent.trim() === "PI - Minor") {
                                box.classList.add(`minorPiCheckbox-${agreementNo}`)
                                checkBoxesContainer.insertBefore(piMinorElem, checkBoxesContainer.children[index + 1]);
                            }
                        })

                    }
                })
            } else if ((label.textContent.includes("PI - D Full Name") || label.textContent.includes("PI - D DOB") ||
                label.textContent.includes("PI - D SSN") || label.textContent.includes("PI - D DOD")) && label.textContent.includes(agreementNo)) {

                label.style.display = "none"
                let pidelem = label.parentElement
                pidelem.querySelector(".hr-form-item-feedback-wrapper").style.display = "none"
                pidelem.style.gridTemplateRows = "auto"
                // console.log(label)
                pidelem.style.display = "none";
                if (label.textContent.includes("PI - D Full Name")) {
                    pidelem.classList.add(`pidFullNameElem-${agreementNo}`)
                } else if (label.textContent.includes("PI - D DOB")) {
                    pidelem.classList.add(`pidDOBElem-${agreementNo}`)
                } else if (label.textContent.includes("PI - D SSN")) {
                    pidelem.classList.add(`pidSSNElem-${agreementNo}`)
                } else if (label.textContent.includes("PI - D DOD")) {
                    pidelem.classList.add(`pidDODElem-${agreementNo}`)
                }

                labels.forEach((label) => {
                    if (label.textContent.includes(agreementNo)) {
                        // console.log("label", label)
                        let wishToSendElem = label.parentElement
                        let checkBoxesContainer = wishToSendElem.querySelector(`[test-data-type="CHECKBOX"]`)
                        let checkBoxes = wishToSendElem.querySelectorAll(`[test-data-type="CHECKBOX"] > div`)
                        checkBoxes.forEach((box, index) => {
                            if (box.textContent.trim() === "PI - D") {
                                box.classList.add(`pidCheckbox-${agreementNo}`)
                                checkBoxesContainer.insertBefore(pidelem, checkBoxesContainer.children[index + 1]);
                            }
                        })

                    }
                })
            } else if ((label.textContent.includes("Benificary's name as written on card") || label.textContent.includes("Number on Medicare Card") ||
                label.textContent.includes("Date of injury for which")) && label.textContent.includes(agreementNo)) {

                label.style.display = "none"
                let piMedicareElem = label.parentElement
                piMedicareElem.querySelector(".hr-form-item-feedback-wrapper").style.display = "none"
                piMedicareElem.style.gridTemplateRows = "auto"
                // console.log(label)
                piMedicareElem.style.display = "none";
                if (label.textContent.includes("Benificary's name as written on card")) {
                    piMedicareElem.classList.add(`beneficiaryNameElem-${agreementNo}`)
                } else if (label.textContent.includes("Number on Medicare Card")) {
                    piMedicareElem.classList.add(`numOnMedicareCardElem-${agreementNo}`)
                } else if (label.textContent.includes("Date of injury for which")) {
                    piMedicareElem.classList.add(`dateOfInjuryElem-${agreementNo}`)
                }

                labels.forEach((label) => {
                    if (label.textContent.includes(agreementNo)) {
                        // console.log("label", label)
                        let wishToSendElem = label.parentElement
                        let checkBoxesContainer = wishToSendElem.querySelector(`[test-data-type="CHECKBOX"]`)
                        let checkBoxes = wishToSendElem.querySelectorAll(`[test-data-type="CHECKBOX"] > div`)
                        checkBoxes.forEach((box, index) => {
                            if (box.textContent.trim() === "PI + Medicare") {
                                box.classList.add(`piMedicareCheckbox-${agreementNo}`)
                                checkBoxesContainer.insertBefore(piMedicareElem, checkBoxesContainer.children[index + 1]);
                            }
                        })

                    }
                })
            } else if ((label.textContent.includes("WC - D Full Name") || label.textContent.includes("WC - D DOB") ||
                label.textContent.includes("WC - D SSN") || label.textContent.includes("WC - D DOD")) && label.textContent.includes(agreementNo)) {

                label.style.display = "none"
                let wcdElem = label.parentElement
                wcdElem.querySelector(".hr-form-item-feedback-wrapper").style.display = "none"
                wcdElem.style.gridTemplateRows = "auto"
                // console.log(label)
                wcdElem.style.display = "none";
                if (label.textContent.includes("WC - D Full Name")) {
                    wcdElem.classList.add(`wcdFullNameElem-${agreementNo}`)
                } else if (label.textContent.includes("WC - D DOB")) {
                    wcdElem.classList.add(`wcdDOBElem-${agreementNo}`)
                } else if (label.textContent.includes("WC - D SSN")) {
                    wcdElem.classList.add(`wcdSSNElem-${agreementNo}`)
                } else if (label.textContent.includes("WC - D DOD")) {
                    wcdElem.classList.add(`wcdDODElem-${agreementNo}`)
                }

                labels.forEach((label) => {
                    if (label.textContent.includes(agreementNo)) {
                        // console.log("label", label)
                        let wishToSendElem = label.parentElement
                        let checkBoxesContainer = wishToSendElem.querySelector(`[test-data-type="CHECKBOX"]`)
                        let checkBoxes = wishToSendElem.querySelectorAll(`[test-data-type="CHECKBOX"] > div`)
                        checkBoxes.forEach((box, index) => {
                            if (box.textContent.trim() === "WC - D") {
                                box.classList.add(`wcdCheckbox-${agreementNo}`)
                                checkBoxesContainer.insertBefore(wcdElem, checkBoxesContainer.children[index + 1]);
                            }
                        })

                    }
                })
            } else if ((label.textContent.includes("Atticus Full Name") || label.textContent.includes("WC - D Atticus DOB") ||
                label.textContent.includes("WC - D Atticus SSN") || label.textContent.includes("WC - D Atticus DOD")) && label.textContent.includes(agreementNo)) {

                label.style.display = "none"
                let wcdAtticusElem = label.parentElement
                wcdAtticusElem.querySelector(".hr-form-item-feedback-wrapper").style.display = "none"
                wcdAtticusElem.style.gridTemplateRows = "auto"
                // console.log(label)
                wcdAtticusElem.style.display = "none";
                if (label.textContent.includes("Atticus Full Name")) {
                    wcdAtticusElem.classList.add(`wcdAtticusFullNameElem-${agreementNo}`)
                } else if (label.textContent.includes("WC - D Atticus DOB")) {
                    wcdAtticusElem.classList.add(`wcdAtticusDOBElem-${agreementNo}`)
                } else if (label.textContent.includes("WC - D Atticus SSN")) {
                    wcdAtticusElem.classList.add(`wcdAtticusSSNElem-${agreementNo}`)
                } else if (label.textContent.includes("WC - D Atticus DOD")) {
                    wcdAtticusElem.classList.add(`wcdAtticusDODElem-${agreementNo}`)
                }

                labels.forEach((label) => {
                    if (label.textContent.includes(agreementNo)) {
                        // console.log("label", label)
                        let wishToSendElem = label.parentElement
                        let checkBoxesContainer = wishToSendElem.querySelector(`[test-data-type="CHECKBOX"]`)
                        let checkBoxes = wishToSendElem.querySelectorAll(`[test-data-type="CHECKBOX"] > div`)
                        checkBoxes.forEach((box, index) => {
                            if (box.textContent.trim() === "WC - D + Atticus") {
                                box.classList.add(`wcdAtticusCheckbox-${agreementNo}`)
                                checkBoxesContainer.insertBefore(wcdAtticusElem, checkBoxesContainer.children[index + 1]);
                            }
                        })

                    }
                })
            }

        })
    }

    function documentOrderSetupAgreementFn(agreementNo) {
        let labels = document.querySelectorAll(".hr-form-item-label");
        // console.log("documentOrderSetupAgreementFn", agreementNo);

        labels?.forEach((label) => {

            const container = label.closest(".hr-form-item");
            // if (!headingsAdded) {
            if (label.textContent.includes(`Which agreement do you wish to send?-${agreementNo}`)) {
                console.log("agreementNo name");
                const heading = document.createElement("div");
                heading.textContent = `Agreement- ${agreementNo}`;
                heading.style.cssText = "font-size:1.2rem; margin-bottom:10px; font-weight:bold;";
                container.insertBefore(heading, container.firstChild);
            }
            // }

            if (label.textContent.includes("Macloskey Minor Name") && label.textContent.includes(agreementNo)) {
                label.style.display = "none"
                let minorNameElem = label.parentElement
                minorNameElem.querySelector(".hr-form-item-feedback-wrapper").style.display = "none"
                minorNameElem.style.gridTemplateRows = "auto"
                // console.log(label)
                minorNameElem.style.display = "none";
                minorNameElem.classList.add(`minorNameElem-${agreementNo}`)

                labels.forEach((label) => {
                    if (label.textContent.includes(agreementNo)) {
                        // console.log("label", label)
                        let wishToSendElem = label.parentElement
                        let checkBoxesContainer = wishToSendElem.querySelector(`[test-data-type="CHECKBOX"]`)
                        let checkBoxes = wishToSendElem.querySelectorAll(`[test-data-type="CHECKBOX"] > div`)
                        checkBoxes.forEach((box, index) => {
                            if (box.textContent.trim() === "MacloskeyKessler Minor Retainer") {
                                box.classList.add(`minorNameCheckbox-${agreementNo}`)
                                checkBoxesContainer.insertBefore(minorNameElem, checkBoxesContainer.children[index + 1]);
                            }
                        })

                    }
                })
            } else if ((label.textContent.includes("Offer")) && label.textContent.includes(agreementNo)) {
                label.style.display = "none"
                let offerElem = label.parentElement
                offerElem.querySelector(".hr-form-item-feedback-wrapper").style.display = "none"
                offerElem.style.gridTemplateRows = "auto"
                // console.log(label)
                offerElem.style.display = "none";
                if (label.textContent.includes("Offer")) {
                    offerElem.classList.add(`offerElem-${agreementNo}`)
                }
                // else if (label.textContent.includes("Black & Jones Email to")) {
                //     offerElem.classList.add(`blackJonesEmailToElem-${agreementNo}`)
                // }

                labels.forEach((label) => {
                    if (label.textContent.includes(agreementNo)) {
                        // console.log("label", label)
                        let wishToSendElem = label.parentElement
                        let checkBoxesContainer = wishToSendElem.querySelector(`[test-data-type="CHECKBOX"]`)
                        let checkBoxes = wishToSendElem.querySelectorAll(`[test-data-type="CHECKBOX"] > div`)
                        checkBoxes.forEach((box, index) => {
                            if (box.textContent.trim() === "MaccloskeyKessler Previous Offer Retainer") {
                                box.classList.add(`previousOfferCheckbox-${agreementNo}`)
                                checkBoxesContainer.insertBefore(offerElem, checkBoxesContainer.children[index + 1]);
                            }
                        })

                    }
                })
            } else if ((label.textContent.includes("Black & Jones Attorney")) && label.textContent.includes(agreementNo)) {
                label.style.display = "none"
                let blackJonesElem = label.parentElement
                blackJonesElem.querySelector(".hr-form-item-feedback-wrapper").style.display = "none"
                blackJonesElem.style.gridTemplateRows = "auto"
                // console.log(label)
                blackJonesElem.style.display = "none";
                if (label.textContent.includes("Black & Jones Attorney")) {
                    blackJonesElem.classList.add(`blackJonesAttorneyNameElem-${agreementNo}`)
                }
                // else if (label.textContent.includes("Black & Jones Email to")) {
                //     blackJonesElem.classList.add(`blackJonesEmailToElem-${agreementNo}`)
                // }

                labels.forEach((label) => {
                    if (label.textContent.includes(agreementNo)) {
                        // console.log("label", label)
                        let wishToSendElem = label.parentElement
                        let checkBoxesContainer = wishToSendElem.querySelector(`[test-data-type="CHECKBOX"]`)
                        let checkBoxes = wishToSendElem.querySelectorAll(`[test-data-type="CHECKBOX"] > div`)
                        checkBoxes.forEach((box, index) => {
                            if (box.textContent.trim() === "Black & Jones Co-Counsel Retainer") {
                                box.classList.add(`blackJonesCheckbox-${agreementNo}`)
                                checkBoxesContainer.insertBefore(blackJonesElem, checkBoxesContainer.children[index + 1]);
                            }
                        })

                    }
                })
            } else if ((label.textContent.includes("Co-Counsel Attorney")) && label.textContent.includes(agreementNo)) {
                label.style.display = "none"
                let coCouncelRetainerElem = label.parentElement
                coCouncelRetainerElem.querySelector(".hr-form-item-feedback-wrapper").style.display = "none"
                coCouncelRetainerElem.style.gridTemplateRows = "auto"
                // console.log(label)
                coCouncelRetainerElem.style.display = "none";
                if (label.textContent.includes("Co-Counsel Attorney")) {
                    coCouncelRetainerElem.classList.add(`coCouncelAttorneyNameElem-${agreementNo}`)
                }
                // else if (label.textContent.includes("Co-Counsel Email")) {
                //     coCouncelRetainerElem.classList.add(`coCouncelEmailToElem-${agreementNo}`)
                // }

                labels.forEach((label) => {
                    if (label.textContent.includes(agreementNo)) {
                        // console.log("label", label)
                        let wishToSendElem = label.parentElement
                        let checkBoxesContainer = wishToSendElem.querySelector(`[test-data-type="CHECKBOX"]`)
                        let checkBoxes = wishToSendElem.querySelectorAll(`[test-data-type="CHECKBOX"] > div`)
                        checkBoxes.forEach((box, index) => {
                            if (box.textContent.trim() === "Co-Counsel Retainer") {
                                box.classList.add(`coCouncelRetainerCheckbox-${agreementNo}`)
                                checkBoxesContainer.insertBefore(coCouncelRetainerElem, checkBoxesContainer.children[index + 1]);
                            }
                        })

                    }
                })
            } else if ((label.textContent.includes("Co-Counsel Minor Name") || label.textContent.includes("Co-Counsel Minor Attorney")) && label.textContent.includes(agreementNo)) {
                label.style.display = "none"
                let coCouncelMinorElem = label.parentElement
                coCouncelMinorElem.querySelector(".hr-form-item-feedback-wrapper").style.display = "none"
                coCouncelMinorElem.style.gridTemplateRows = "auto"
                // console.log(label)
                coCouncelMinorElem.style.display = "none";
                if (label.textContent.includes("Co-Counsel Minor Name")) {
                    coCouncelMinorElem.classList.add(`coCouncelMinorNameElem-${agreementNo}`)
                } else if (label.textContent.includes("Co-Counsel Minor Attorney")) {
                    coCouncelMinorElem.classList.add(`coCouncelMinorAttorneyElem-${agreementNo}`)
                }
                // else if (label.textContent.includes("Co-Counsel Minor Email")) {
                //     coCouncelMinorElem.classList.add(`coCouncelMinorEmailToElem-${agreementNo}`)
                // }

                labels.forEach((label) => {
                    if (label.textContent.includes(agreementNo)) {
                        // console.log("label", label)
                        let wishToSendElem = label.parentElement
                        let checkBoxesContainer = wishToSendElem.querySelector(`[test-data-type="CHECKBOX"]`)
                        let checkBoxes = wishToSendElem.querySelectorAll(`[test-data-type="CHECKBOX"] > div`)
                        checkBoxes.forEach((box, index) => {
                            if (box.textContent.trim() === "Co-Counsel Minor Retainer") {
                                box.classList.add(`coCouncelMinorCheckbox-${agreementNo}`)
                                checkBoxesContainer.insertBefore(coCouncelMinorElem, checkBoxesContainer.children[index + 1]);
                            }
                        })

                    }
                })
            } else if ((label.textContent.includes("Waived as a result of representing (full name)-eng") || label.textContent.includes("Location of incident- Eng")) && label.textContent.includes(agreementNo)) {
                label.style.display = "none"
                let conflictWaiverEngElem = label.parentElement
                conflictWaiverEngElem.querySelector(".hr-form-item-feedback-wrapper").style.display = "none"
                conflictWaiverEngElem.style.gridTemplateRows = "auto"
                // console.log(label)
                conflictWaiverEngElem.style.display = "none";
                if (label.textContent.includes("Waived as a result of representing (full name)-eng")) {
                    conflictWaiverEngElem.classList.add(`conflictWaivedEngElem-${agreementNo}`)
                } else if (label.textContent.includes("Location of incident- Eng")) {
                    conflictWaiverEngElem.classList.add(`conflictLocationEngElem-${agreementNo}`)
                }

                labels.forEach((label) => {
                    if (label.textContent.includes(agreementNo)) {
                        // console.log("label", label)
                        let wishToSendElem = label.parentElement
                        let checkBoxesContainer = wishToSendElem.querySelector(`[test-data-type="CHECKBOX"]`)
                        let checkBoxes = wishToSendElem.querySelectorAll(`[test-data-type="CHECKBOX"] > div`)
                        checkBoxes.forEach((box, index) => {
                            if (box.textContent.trim() === "Conflict Waiver in English") {
                                box.classList.add(`conflictWaiverEngCheckbox-${agreementNo}`)
                                checkBoxesContainer.insertBefore(conflictWaiverEngElem, checkBoxesContainer.children[index + 1]);
                            }
                        })

                    }
                })
            } else if ((label.textContent.includes("Waived as a result of representing (full name)-spa") || label.textContent.includes("Location of incident- Spa")) && label.textContent.includes(agreementNo)) {
                label.style.display = "none"
                let conflictWaiverSpaElem = label.parentElement
                conflictWaiverSpaElem.querySelector(".hr-form-item-feedback-wrapper").style.display = "none"
                conflictWaiverSpaElem.style.gridTemplateRows = "auto"
                // console.log(label)
                conflictWaiverSpaElem.style.display = "none";
                if (label.textContent.includes("Waived as a result of representing (full name)-spa")) {
                    conflictWaiverSpaElem.classList.add(`conflictWaivedSpaElem-${agreementNo}`)
                } else if (label.textContent.includes("Location of incident- Spa")) {
                    conflictWaiverSpaElem.classList.add(`conflictLocationSpaElem-${agreementNo}`)
                }

                labels.forEach((label) => {
                    if (label.textContent.includes(agreementNo)) {
                        // console.log("label", label)
                        let wishToSendElem = label.parentElement
                        let checkBoxesContainer = wishToSendElem.querySelector(`[test-data-type="CHECKBOX"]`)
                        let checkBoxes = wishToSendElem.querySelectorAll(`[test-data-type="CHECKBOX"] > div`)
                        checkBoxes.forEach((box, index) => {
                            if (box.textContent.trim() === "Conflict Waiver in Spanish") {
                                box.classList.add(`conflictWaiverSpaCheckbox-${agreementNo}`)
                                checkBoxesContainer.insertBefore(conflictWaiverSpaElem, checkBoxesContainer.children[index + 1]);
                            }
                        })

                    }
                })
            }
        })
    }



    function agreementOrderSetUpFn() {
        let labels = document.querySelectorAll(".hr-form-item-label");

        labels?.forEach((label) => {
            if (label.textContent === "Revocable Trust (TEXT)") {
                label.style.display = "none"
                let revocableElem = label.parentElement
                revocableElem.querySelector(".hr-form-item-feedback-wrapper").style.display = "none"
                revocableElem.style.gridTemplateRows = "auto"
                // console.log(label)
                revocableElem.style.display = "none";
                revocableElem.classList.add("revocableField")

                labels.forEach((label) => {
                    if (label.textContent === "Services") {
                        // console.log("label", label)
                        let serviceParentElem = label.parentElement
                        let checkBoxesContainer = serviceParentElem.querySelector(`[test-data-type="CHECKBOX"]`)
                        let checkBoxes = serviceParentElem.querySelectorAll(`[test-data-type="CHECKBOX"] > div`)
                        checkBoxes.forEach((box, index) => {
                            if (box.textContent.trim() === "Revocable Trust(s):") {
                                box.querySelector(`[role="checkbox"]`).classList.add("revocableCheckbox")
                                checkBoxesContainer.insertBefore(revocableElem, checkBoxesContainer.children[index + 1]);
                            }
                        })

                    }
                })
            } else if (label.textContent === "Irrevocable Trust (TEXT)") {
                label.style.display = "none"
                let irrevocableElem = label.parentElement
                irrevocableElem.querySelector(".hr-form-item-feedback-wrapper").style.display = "none"
                irrevocableElem.style.gridTemplateRows = "auto"
                irrevocableElem.style.display = "none";
                irrevocableElem.classList.add("irrevocableField")

                labels.forEach((label) => {
                    if (label.textContent === "Services") {
                        // console.log("label", label)
                        let serviceParentElem = label.parentElement
                        let checkBoxesContainer = serviceParentElem.querySelector(`[test-data-type="CHECKBOX"]`)
                        let checkBoxes = serviceParentElem.querySelectorAll(`[test-data-type="CHECKBOX"] > div`)
                        checkBoxes.forEach((box, index) => {
                            if (box.textContent.trim() === "Irrevocable Trust(s):") {
                                box.querySelector(`[role="checkbox"]`).classList.add("irrevocableCheckbox")
                                checkBoxesContainer.insertBefore(irrevocableElem, checkBoxesContainer.children[index + 1]);
                            }
                        })

                    }
                })
            } else if (label.textContent === "# of properties (TEXT)") {
                label.style.display = "none"
                let propertiesElem = label.parentElement
                propertiesElem.querySelector(".hr-form-item-feedback-wrapper").style.display = "none"
                propertiesElem.style.gridTemplateRows = "auto"
                propertiesElem.style.display = "none";
                propertiesElem.classList.add("propertiesField")

                labels.forEach((label) => {
                    if (label.textContent === "Services") {
                        // console.log("label", label)
                        let serviceParentElem = label.parentElement
                        let checkBoxesContainer = serviceParentElem.querySelector(`[test-data-type="CHECKBOX"]`)
                        let checkBoxes = serviceParentElem.querySelectorAll(`[test-data-type="CHECKBOX"] > div`)
                        checkBoxes.forEach((box, index) => {
                            if (box.textContent.trim() === "# of properties") {
                                box.querySelector(`[role="checkbox"]`).classList.add("propertiesCheckbox")
                                checkBoxesContainer.insertBefore(propertiesElem, checkBoxesContainer.children[index + 1]);
                            }
                        })

                    }
                })
            }

        })
    }

    function getLocationId() {
        let url = window.location.href
        let locationMatch = url.match(/\/location\/([^/]+)/);
        let locationId = locationMatch ? locationMatch[1] : null
        return locationId
    }

    function waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

</script>


<script>var personaliser = "eyJpdiI6Ik10VGR1UG5vT2sxTHl3ZkNEUUd6MHc9PSIsInZhbHVlIjoiTmpVRnhGUGJjUEc3QjVIekVuL09QMWtuZVlhejRjMFNQd2gvWGxWeHRqST0iLCJtYWMiOiI3MDU0NTFkM2Y3N2Q4Mzk1Zjc4NGQwZDMwOTBiNWE4YmEzNzA5YWY2MDkxZDc2N2RmZGRiYWEyNzQzY2UzN2NhIn0="</script>
<script src="https://code.jquery.com/jquery-3.6.0.js" integrity="sha256-H+K7U5CnXl1h5ywQfKtSj8PCmoN9aaq30gDh27Xc0jk="
    crossorigin="anonymous"></script>
<script src="https://sn.getmycrmagency.com/js/initiator.js?v=50"></script>


<!-- <script>
        (() => {
            const s = document.createElement('script');
            s.src = 'https://cdn.chatwidgets.net/widget/unified-script-prod/support-os-unified-script.js?t=' + Date.now();
            s.id = 'support-os-unified-script';
            s.dataset.env = 'https://graph.mycrmsupport.net';
            s.dataset.account = 'aBOuoeGk8c6v_N9k';
            document.body.appendChild(s);
        })();
</script> -->


<script>var personaliser = 528</script>
<script src="https://code.jquery.com/jquery-3.6.0.js" integrity="sha256-H+K7U5CnXl1h5ywQfKtSj8PCmoN9aaq30gDh27Xc0jk="
    crossorigin="anonymous"></script>


<script>
    var alreadyRan = false;

    var checkOpportunityWindowTabOpenTimeOut = null;
    function checkOpportunityWindowTabOpen() {
        var opportunitiesElement = document.getElementById("data-create-opportunity");
        if (opportunitiesElement) {
            if (opportunitiesElement.style.display === "none") {

            }
            else {
                opportunitiesElement.style.display = "none";
            }
            setTimeout(checkLocationid, 500);


        }
        else {
            setTimeout(checkOpportunityWindowTabOpen, 500);

        }
    }


    checkLocationid();
    var alreadyInLocation = false;

    var checkLocationidTO = null;
    function checkLocationid() {

        var currentUrl = window.location.href;

        var pattern = /AbrysmLu4gLTzLrkLtAf/;
        if (pattern.test(currentUrl)) {
            checkOpportunityWindowTabOpen();
        } else {
            setTimeout(checkLocationid, 500);
        }
    }

window.addEventListener("routeChangeEvent", function () {

    if (!window.location.href.includes("/v2/location/oUKKuxKyYWHUoncYOKhr")) return;

    setTimeout(() => {

        setInterval(() => {

            let show = false;

            document.querySelectorAll(".hr-form-item").forEach(item => {
                const label = item.querySelector(".hr-form-item-label__text")?.textContent?.trim();

                if (label === "Third Party Payor?") {
                    const yes = item.querySelector("input[value='Yes']");
                    if (yes && yes.checked) show = true;
                }
            });

            document.querySelectorAll(".hr-form-item").forEach(item => {
                const label = item.querySelector(".hr-form-item-label__text")?.textContent?.trim();

                if (label === "Number of Installments (Contracts)") {
                    item.style.setProperty("display", "none", "important");
                }

                if (
                    label === "3rd Party Payor Name" ||
                    label === "Third Party Payor Email" ||
                    label === "Third Party Payer Phone"
                ) {
                    item.style.setProperty(
                        "display",
                        show ? "" : "none",
                        "important"
                    );
                }
            });

        }, 400);

    }, 2000);

});
</script>
<script type="text/javascript">
    (function (c, l, a, r, i, t, y) {
        c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments) };
        t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
        y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", "kz2i8x5eve");
</script>

<script>
(function() {

    function applyLostNoteVisibility() {

        // Only run for this specific location
        if (!window.location.href.includes("/v2/location/oUKKuxKyYWHUoncYOKhr")) return;

        // Find the "Reason for LOST:" field
        const allFormItems = [...document.querySelectorAll(".hr-form-item")];

        const reasonForLostField = allFormItems.find(item =>
            item.querySelector(".hr-form-item-label__text")
                ?.textContent?.trim() === "Reason for LOST:"
        );

        const reasonForLostNoteField = allFormItems.find(item =>
            item.querySelector(".hr-form-item-label__text")
                ?.textContent?.trim() === "Reason For Lost Note"
        );

        // If both fields not found yet, do nothing (DOM not ready)
        if (!reasonForLostField || !reasonForLostNoteField) return;

        // Check current selected value in the dropdown
        const selectedValue = reasonForLostField
            .querySelector(".hr-base-selection-input__content, .n-base-selection-input__content")
            ?.textContent?.trim();

        // Show if any value selected, hide if empty/placeholder
        if (selectedValue && selectedValue !== "" && selectedValue !== "Reason for LOST:") {
            reasonForLostNoteField.style.setProperty("display", "", "important");
        } else {
            reasonForLostNoteField.style.setProperty("display", "none", "important");
        }

        // Attach dropdown change observer only once per field instance
        if (reasonForLostField._lostNoteObserverAttached) return;
        reasonForLostField._lostNoteObserverAttached = true;

        const dropdownLabel = reasonForLostField.querySelector(
            ".hr-base-selection-label, .n-base-selection-label"
        );

        if (dropdownLabel) {
            const dropdownObserver = new MutationObserver(() => {
                setTimeout(applyLostNoteVisibility, 50);
            });

            dropdownObserver.observe(dropdownLabel, {
                childList: true,
                subtree: true,
                characterData: true,
                attributes: true
            });
        }
    }

    // Watch the entire body for DOM changes
    // This catches: card opening, tab switching, any re-render
    const bodyObserver = new MutationObserver(() => {
        if (!window.location.href.includes("/v2/location/oUKKuxKyYWHUoncYOKhr")) return;
        applyLostNoteVisibility();
    });

    bodyObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Also re-run on every route change in case location changes
    window.addEventListener("routeChangeEvent", function() {
        // Small delay to let DOM settle after route change
        setTimeout(applyLostNoteVisibility, 500);
    });

})();
</script>

<script>
(function() {

    function applyOtherNotesVisibility() {

        // Only run for this specific location
        if (!window.location.href.includes("/v2/location/oUKKuxKyYWHUoncYOKhr")) return;

        // Find all form items
        const allFormItems = [...document.querySelectorAll(".hr-form-item")];

        // Find the "Referral Source (Client Reported):" dropdown field
        const referralSourceField = allFormItems.find(item =>
            item.querySelector(".hr-form-item-label__text")
                ?.textContent?.trim() === "Referral Source (Client Reported):"
        );

        // Find the "Other Notes" text field
        const otherNotesField = allFormItems.find(item =>
            item.querySelector(".hr-form-item-label__text")
                ?.textContent?.trim() === "Other Notes"
        );

        // If both fields not found yet, DOM not ready — do nothing
        if (!referralSourceField || !otherNotesField) return;

        // Check what is currently selected in the dropdown
        const selectedValue = referralSourceField
            .querySelector(".hr-base-selection-input__content, .n-base-selection-input__content")
            ?.textContent?.trim();

        // Show if any real value selected, hide if empty or showing placeholder
        if (selectedValue && selectedValue !== "" && selectedValue !== "Referral Source (Client Reported):") {
            otherNotesField.style.setProperty("display", "", "important");
        } else {
            otherNotesField.style.setProperty("display", "none", "important");
        }

        // Attach dropdown change observer only once per field instance
        if (referralSourceField._otherNotesObserverAttached) return;
        referralSourceField._otherNotesObserverAttached = true;

        const dropdownLabel = referralSourceField.querySelector(
            ".hr-base-selection-label, .n-base-selection-label"
        );

        if (dropdownLabel) {
            const dropdownObserver = new MutationObserver(() => {
                setTimeout(applyOtherNotesVisibility, 50);
            });

            dropdownObserver.observe(dropdownLabel, {
                childList: true,
                subtree: true,
                characterData: true,
                attributes: true
            });
        }
    }

    // Watch entire body for DOM changes
    // Catches: card opening, tab switching, any re-render
    const bodyObserver = new MutationObserver(() => {
        if (!window.location.href.includes("/v2/location/oUKKuxKyYWHUoncYOKhr")) return;
        applyOtherNotesVisibility();
    });

    bodyObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Re-run on every route change
    window.addEventListener("routeChangeEvent", function() {
        setTimeout(applyOtherNotesVisibility, 500);
    });

})();
</script>

<script>
(function() {

    function applyAdditionalContactVisibility() {

        // ✅ Scope to correct sub-account
        if (!window.location.href.includes("/v2/location/oUKKuxKyYWHUoncYOKhr")) return;

        const allFormItems = [...document.querySelectorAll(".hr-form-item")];

        // 🔍 Find main radio field
        const additionalContactField = allFormItems.find(item =>
            item.querySelector(".hr-form-item-label__text")
                ?.textContent?.trim() === "Additional Contact"
        );

        // 🔍 Find dependent fields
        const dependentFields = allFormItems.filter(item => {
            const label = item.querySelector(".hr-form-item-label__text")?.textContent?.trim();

            return (
                label === "Additional Contact Name" ||
                label === "Additional Contact Phone" ||
                label === "Additional Contact Email" ||
                label === "Additional Contact DOB" ||
                label === "Additional Contact Mailing Address"
            );
        });

        if (!additionalContactField || dependentFields.length === 0) return;

        // ✅ Get current radio value
        const yesRadio = additionalContactField.querySelector("input[value='Yes']");
        const isYes = yesRadio && yesRadio.checked;

        // 🔥 APPLY VISIBILITY
        dependentFields.forEach(field => {
            field.style.setProperty(
                "display",
                isYes ? "" : "none",
                "important"
            );
        });

        // 🚫 Prevent duplicate listeners
        if (additionalContactField._observerAttached) return;
        additionalContactField._observerAttached = true;

        // ✅ Listen to radio changes
        const radios = additionalContactField.querySelectorAll("input[type='radio']");

        radios.forEach(radio => {
            radio.addEventListener("change", () => {
                setTimeout(applyAdditionalContactVisibility, 50);
            });
        });
    }

    // 🔥 GLOBAL OBSERVER (same as your working script)
    const bodyObserver = new MutationObserver(() => {
        if (!window.location.href.includes("/v2/location/oUKKuxKyYWHUoncYOKhr")) return;
        applyAdditionalContactVisibility();
    });

    bodyObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 🔁 Re-run on route change
    window.addEventListener("routeChangeEvent", function() {
        setTimeout(applyAdditionalContactVisibility, 500);
    });

})();
</script>

<script>
(function() {

    function applyProbationVisibility() {

        // ✅ Scope to correct sub-account
        if (!window.location.href.includes("/v2/location/oUKKuxKyYWHUoncYOKhr")) return;

        const allFormItems = [...document.querySelectorAll(".hr-form-item")];

        // 🔍 Find radio field
        const probationField = allFormItems.find(item =>
            item.querySelector(".hr-form-item-label__text")
                ?.textContent?.trim() === "Currently on Probation?"
        );

        // 🔍 Find dependent field
        const probationEndYearField = allFormItems.find(item =>
            item.querySelector(".hr-form-item-label__text")
                ?.textContent?.trim() === "Probation End Year"
        );

        if (!probationField || !probationEndYearField) return;

        // ✅ Check selected value
        const yesRadio = probationField.querySelector("input[value='Yes']");
        const isYes = yesRadio && yesRadio.checked;

        // 🔥 Apply visibility
        probationEndYearField.style.setProperty(
            "display",
            isYes ? "" : "none",
            "important"
        );

        // 🚫 Prevent duplicate listeners
        if (probationField._observerAttached) return;
        probationField._observerAttached = true;

        // ✅ Listen for radio change
        const radios = probationField.querySelectorAll("input[type='radio']");
        radios.forEach(radio => {
            radio.addEventListener("change", () => {
                setTimeout(applyProbationVisibility, 50);
            });
        });
    }

    // 🔥 GLOBAL OBSERVER (handles tab switch + modal load)
    const bodyObserver = new MutationObserver(() => {
        if (!window.location.href.includes("/v2/location/oUKKuxKyYWHUoncYOKhr")) return;
        applyProbationVisibility();
    });

    bodyObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 🔁 Re-run on route change
    window.addEventListener("routeChangeEvent", function() {
        setTimeout(applyProbationVisibility, 500);
    });

})();

</script>

<script>
(function() {

    function applyFailureToRegisterVisibility() {

        // ✅ Scope to correct sub-account
        if (!window.location.href.includes("/v2/location/oUKKuxKyYWHUoncYOKhr")) return;

        const allFormItems = [...document.querySelectorAll(".hr-form-item")];

        // 🔍 Find radio field
        const violationField = allFormItems.find(item =>
            item.querySelector(".hr-form-item-label__text")
                ?.textContent?.trim() === "Did you have any failure to register violations?"
        );

        // 🔍 Find dependent field
        const notesField = allFormItems.find(item =>
            item.querySelector(".hr-form-item-label__text")
                ?.textContent?.trim() === "Failure to Register Notes:"
        );

        if (!violationField || !notesField) return;

        // ✅ Check selected value
        const yesRadio = violationField.querySelector("input[value='Yes']");
        const isYes = yesRadio && yesRadio.checked;

        // 🔥 Apply visibility
        notesField.style.setProperty(
            "display",
            isYes ? "" : "none",
            "important"
        );

        // 🚫 Prevent duplicate listeners
        if (violationField._observerAttached) return;
        violationField._observerAttached = true;

        // ✅ Listen for radio change
        const radios = violationField.querySelectorAll("input[type='radio']");
        radios.forEach(radio => {
            radio.addEventListener("change", () => {
                setTimeout(applyFailureToRegisterVisibility, 50);
            });
        });
    }

    // 🔥 Global observer (handles modal load + tab switch)
    const bodyObserver = new MutationObserver(() => {
        if (!window.location.href.includes("/v2/location/oUKKuxKyYWHUoncYOKhr")) return;
        applyFailureToRegisterVisibility();
    });

    bodyObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 🔁 Re-run on route change
    window.addEventListener("routeChangeEvent", function() {
        setTimeout(applyFailureToRegisterVisibility, 500);
    });

})();
</script>
<script>
(function() {

    function applyOtherArrestNotesVisibility() {

        // ✅ Scope to correct sub-account
        if (!window.location.href.includes("/v2/location/oUKKuxKyYWHUoncYOKhr")) return;

        const allFormItems = [...document.querySelectorAll(".hr-form-item")];

        // 🔍 Find radio field
        const otherArrestsField = allFormItems.find(item =>
            item.querySelector(".hr-form-item-label__text")
                ?.textContent?.trim() === "Other arrests?"
        );

        // 🔍 Find dependent field
        const notesField = allFormItems.find(item =>
            item.querySelector(".hr-form-item-label__text")
                ?.textContent?.trim() === "Other Arrest Notes:"
        );

        if (!otherArrestsField || !notesField) return;

        // ✅ Check selected value
        const yesRadio = otherArrestsField.querySelector("input[value='Yes']");
        const isYes = yesRadio && yesRadio.checked;

        // 🔥 Apply visibility
        notesField.style.setProperty(
            "display",
            isYes ? "" : "none",
            "important"
        );

        // 🚫 Prevent duplicate listeners
        if (otherArrestsField._observerAttached) return;
        otherArrestsField._observerAttached = true;

        // ✅ Listen for radio change
        const radios = otherArrestsField.querySelectorAll("input[type='radio']");
        radios.forEach(radio => {
            radio.addEventListener("change", () => {
                setTimeout(applyOtherArrestNotesVisibility, 50);
            });
        });
    }

    // 🔥 Global observer (handles modal + tab rendering)
    const bodyObserver = new MutationObserver(() => {
        if (!window.location.href.includes("/v2/location/oUKKuxKyYWHUoncYOKhr")) return;
        applyOtherArrestNotesVisibility();
    });

    bodyObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 🔁 Re-run on route change
    window.addEventListener("routeChangeEvent", function() {
        setTimeout(applyOtherArrestNotesVisibility, 500);
    });

})();
</script>

<script>
(function() {

    function applyProbationViolationNotesVisibility() {

        // ✅ Scope to correct sub-account
        if (!window.location.href.includes("/v2/location/oUKKuxKyYWHUoncYOKhr")) return;

        const allFormItems = [...document.querySelectorAll(".hr-form-item")];

        // 🔍 Find radio field
        const violationField = allFormItems.find(item =>
            item.querySelector(".hr-form-item-label__text")
                ?.textContent?.trim() === "Did you have any probation violations?"
        );

        // 🔍 Find dependent field
        const notesField = allFormItems.find(item =>
            item.querySelector(".hr-form-item-label__text")
                ?.textContent?.trim() === "Probation violation notes:"
        );

        if (!violationField || !notesField) return;

        // ✅ Check selected value
        const yesRadio = violationField.querySelector("input[value='Yes']");
        const isYes = yesRadio && yesRadio.checked;

        // 🔥 Apply visibility
        notesField.style.setProperty(
            "display",
            isYes ? "" : "none",
            "important"
        );

        // 🚫 Prevent duplicate listeners
        if (violationField._observerAttached) return;
        violationField._observerAttached = true;

        // ✅ Listen for radio change
        const radios = violationField.querySelectorAll("input[type='radio']");
        radios.forEach(radio => {
            radio.addEventListener("change", () => {
                setTimeout(applyProbationViolationNotesVisibility, 50);
            });
        });
    }

    // 🔥 Global observer
    const bodyObserver = new MutationObserver(() => {
        if (!window.location.href.includes("/v2/location/oUKKuxKyYWHUoncYOKhr")) return;
        applyProbationViolationNotesVisibility();
    });

    bodyObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 🔁 Route change re-run
    window.addEventListener("routeChangeEvent", function() {
        setTimeout(applyProbationViolationNotesVisibility, 500);
    });

})();
</script>
<script>
(function() {

    function applyBondAmountVisibility() {

        // ✅ Scope to correct sub-account
        if (!window.location.href.includes("/v2/location/oUKKuxKyYWHUoncYOKhr")) return;

        const allFormItems = [...document.querySelectorAll(".hr-form-item")];

        // 🔍 Find radio field
        const bondField = allFormItems.find(item =>
            item.querySelector(".hr-form-item-label__text")
                ?.textContent?.trim() === "Did you receive a bond?"
        );

        // 🔍 Find dependent field
        const bondAmountField = allFormItems.find(item =>
            item.querySelector(".hr-form-item-label__text")
                ?.textContent?.trim() === "Bond Amount: (Intake)"
        );

        if (!bondField || !bondAmountField) return;

        // ✅ Check selected value
        const yesRadio = bondField.querySelector("input[value='Yes']");
        const isYes = yesRadio && yesRadio.checked;

        // 🔥 Apply visibility
        bondAmountField.style.setProperty(
            "display",
            isYes ? "" : "none",
            "important"
        );

        // 🚫 Prevent duplicate listeners
        if (bondField._observerAttached) return;
        bondField._observerAttached = true;

        // ✅ Listen for radio change
        const radios = bondField.querySelectorAll("input[type='radio']");
        radios.forEach(radio => {
            radio.addEventListener("change", () => {
                setTimeout(applyBondAmountVisibility, 50);
            });
        });
    }

    // 🔥 Global observer (handles modal + tab rendering)
    const bodyObserver = new MutationObserver(() => {
        if (!window.location.href.includes("/v2/location/oUKKuxKyYWHUoncYOKhr")) return;
        applyBondAmountVisibility();
    });

    bodyObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 🔁 Re-run on route change
    window.addEventListener("routeChangeEvent", function() {
        setTimeout(applyBondAmountVisibility, 500);
    });

})();
</script>
<script>
(function() {

    function applyNewArrestsDescriptionVisibility() {

        // ✅ Scope to correct sub-account
        if (!window.location.href.includes("/v2/location/oUKKuxKyYWHUoncYOKhr")) return;

        const allFormItems = [...document.querySelectorAll(".hr-form-item")];

        // 🔍 Find radio field
        const triggerField = allFormItems.find(item =>
            item.querySelector(".hr-form-item-label__text")
                ?.textContent?.trim() === "Any new arrests or charges since you were convicted?"
        );

        // 🔍 Find dependent field
        const targetField = allFormItems.find(item =>
            item.querySelector(".hr-form-item-label__text")
                ?.textContent?.trim() === "New Arrests/Charges Description:"
        );

        if (!triggerField || !targetField) return;

        // ✅ Check selected value
        const yesRadio = triggerField.querySelector("input[value='Yes']");
        const isYes = yesRadio && yesRadio.checked;

        // 🔥 Apply visibility
        targetField.style.setProperty(
            "display",
            isYes ? "" : "none",
            "important"
        );

        // 🚫 Prevent duplicate listeners
        if (triggerField._observerAttached) return;
        triggerField._observerAttached = true;

        // ✅ Listen for radio change
        const radios = triggerField.querySelectorAll("input[type='radio']");
        radios.forEach(radio => {
            radio.addEventListener("change", () => {
                setTimeout(applyNewArrestsDescriptionVisibility, 50);
            });
        });
    }

    // 🔥 Global observer (handles modal + tab rendering)
    const bodyObserver = new MutationObserver(() => {
        if (!window.location.href.includes("/v2/location/oUKKuxKyYWHUoncYOKhr")) return;
        applyNewArrestsDescriptionVisibility();
    });

    bodyObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 🔁 Re-run on route change
    window.addEventListener("routeChangeEvent", function() {
        setTimeout(applyNewArrestsDescriptionVisibility, 500);
    });

})();
</script>
<script>
(function() {

    function applyInstallmentPlanVisibility() {

        // ✅ Scope to correct sub-account
        if (!window.location.href.includes("/v2/location/oUKKuxKyYWHUoncYOKhr")) return;

        const allFormItems = [...document.querySelectorAll(".hr-form-item")];

        // 🔍 Find trigger field
        const installmentPlanField = allFormItems.find(item =>
            item.querySelector(".hr-form-item-label__text")
                ?.textContent?.trim() === "Installment Plan?"
        );

        // 🔍 Find dependent fields
        const dependentFields = allFormItems.filter(item => {
            const label = item.querySelector(".hr-form-item-label__text")?.textContent?.trim();

            return (
                label === "Number of Installments" ||
                label === "Installment Amount" ||
                label === "Installment Start Month" ||
                label === "Installment Due Day"
            );
        });

        if (!installmentPlanField || dependentFields.length === 0) return;

        // ✅ Check selected value
        const yesRadio = installmentPlanField.querySelector("input[value='Yes']");
        const isYes = yesRadio && yesRadio.checked;

        // 🔥 Apply visibility
        dependentFields.forEach(field => {
            field.style.setProperty(
                "display",
                isYes ? "" : "none",
                "important"
            );
        });

        // 🚫 Prevent duplicate listeners
        if (installmentPlanField._observerAttached) return;
        installmentPlanField._observerAttached = true;

        // ✅ Listen for radio change
        const radios = installmentPlanField.querySelectorAll("input[type='radio']");
        radios.forEach(radio => {
            radio.addEventListener("change", () => {
                setTimeout(applyInstallmentPlanVisibility, 50);
            });
        });
    }

    // 🔥 Global observer (handles modal + tab rendering)
    const bodyObserver = new MutationObserver(() => {
        if (!window.location.href.includes("/v2/location/oUKKuxKyYWHUoncYOKhr")) return;
        applyInstallmentPlanVisibility();
    });

    bodyObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 🔁 Re-run on route change
    window.addEventListener("routeChangeEvent", function() {
        setTimeout(applyInstallmentPlanVisibility, 500);
    });

})();
</script>
//Mackloskey intakeDocument Mapping
<script src="https://petersburg-warnings-comfortable-bottom.trycloudflare.com/js/adiv1_macckloskey.js"></script>
//frye contract 
<script src="https://petersburg-warnings-comfortable-bottom.trycloudflare.com/js/adiv1.js"></script>
<script src="https://petersburg-warnings-comfortable-bottom.trycloudflare.com/js/adiv1_contract.js"></script>