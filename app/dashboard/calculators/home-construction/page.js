<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Home Design & Cost Estimator</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Roboto', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #f5f5f5;
            color: #2c2c2c;
            line-height: 1.6;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
        }

        header {
            background: white;
            padding: 30px 0;
            border-bottom: 1px solid #e0e0e0;
            margin-bottom: 30px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        header h1 {
            font-size: 28px;
            font-weight: 600;
            color: #1a1a1a;
            margin-bottom: 5px;
        }

        header p {
            font-size: 14px;
            color: #666;
        }

        .progress-bar {
            background: white;
            padding: 20px;
            margin-bottom: 30px;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .progress-steps {
            display: flex;
            justify-content: space-between;
            position: relative;
        }

        .progress-steps::before {
            content: '';
            position: absolute;
            top: 20px;
            left: 0;
            right: 0;
            height: 2px;
            background: #e0e0e0;
            z-index: 0;
        }

        .progress-step {
            flex: 1;
            text-align: center;
            position: relative;
            z-index: 1;
        }

        .progress-step.active .step-number {
            background: #2c5aa0;
            color: white;
        }

        .progress-step.completed .step-number {
            background: #4caf50;
            color: white;
        }

        .step-number {
            width: 40px;
            height: 40px;
            margin: 0 auto 8px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #e0e0e0;
            font-weight: 600;
            color: #666;
            transition: all 0.3s ease;
        }

        .step-label {
            font-size: 12px;
            color: #666;
            font-weight: 500;
        }

        .content-wrapper {
            display: grid;
            grid-template-columns: 1fr;
            gap: 30px;
        }

        .main-panel {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .sidebar {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
            height: fit-content;
            position: sticky;
            top: 20px;
        }

        .section-title {
            font-size: 18px;
            font-weight: 600;
            color: #1a1a1a;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #2c5aa0;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }

        .form-row.full {
            grid-template-columns: 1fr;
        }

        label {
            display: block;
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 6px;
            color: #333;
        }

        input[type="text"],
        input[type="number"],
        select,
        textarea {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid #d0d0d0;
            border-radius: 6px;
            font-size: 14px;
            font-family: inherit;
            color: #333;
            transition: border-color 0.2s;
        }

        input[type="text"]:focus,
        input[type="number"]:focus,
        select:focus,
        textarea:focus {
            outline: none;
            border-color: #2c5aa0;
            box-shadow: 0 0 0 3px rgba(44, 90, 160, 0.1);
        }

        .checkbox-group,
        .radio-group {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
        }

        .checkbox-item,
        .radio-item {
            display: flex;
            align-items: center;
        }

        input[type="checkbox"],
        input[type="radio"] {
            margin-right: 8px;
            cursor: pointer;
            width: 16px;
            height: 16px;
            accent-color: #2c5aa0;
        }

        .checkbox-item label,
        .radio-item label {
            margin: 0;
            cursor: pointer;
            font-weight: normal;
        }

        .hint-text {
            font-size: 12px;
            color: #888;
            margin-top: 4px;
        }

        .button-group {
            display: flex;
            gap: 12px;
            margin-top: 30px;
            justify-content: flex-end;
        }

        button {
            padding: 12px 24px;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
        }

        .btn-primary {
            background: #2c5aa0;
            color: white;
        }

        .btn-primary:hover {
            background: #1e3f5a;
            box-shadow: 0 2px 8px rgba(44, 90, 160, 0.3);
        }

        .btn-secondary {
            background: #e0e0e0;
            color: #333;
        }

        .btn-secondary:hover {
            background: #d0d0d0;
        }

        .btn-outline {
            border: 2px solid #2c5aa0;
            background: transparent;
            color: #2c5aa0;
        }

        .btn-outline:hover {
            background: #f0f5ff;
        }

        .btn-small {
            padding: 8px 16px;
            font-size: 12px;
        }

        .tab-container {
            margin-top: 20px;
        }

        .tab-buttons {
            display: flex;
            gap: 10px;
            border-bottom: 1px solid #e0e0e0;
            margin-bottom: 20px;
        }

        .tab-button {
            padding: 12px 20px;
            background: transparent;
            border: none;
            border-bottom: 3px solid transparent;
            color: #666;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.2s;
        }

        .tab-button.active {
            color: #2c5aa0;
            border-bottom-color: #2c5aa0;
        }

        .tab-content {
            display: none;
        }

        .tab-content.active {
            display: block;
        }

        .plan-container {
            background: #fafafa;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            min-height: 400px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        }

        .plan-canvas {
            width: 100%;
            height: 100%;
            max-width: 600px;
            max-height: 600px;
        }

        #threeDContainer {
            width: 100%;
            height: 500px;
            background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
            border-radius: 8px;
            position: relative;
        }

        .loading-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 20px;
            padding: 40px;
        }

        .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #e0e0e0;
            border-top-color: #2c5aa0;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .cost-breakdown {
            margin-top: 20px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
        }

        thead {
            background: #f5f5f5;
        }

        th {
            padding: 12px;
            text-align: left;
            font-weight: 600;
            color: #333;
            border-bottom: 2px solid #e0e0e0;
            font-size: 13px;
        }

        td {
            padding: 12px;
            border-bottom: 1px solid #e0e0e0;
            font-size: 13px;
        }

        tr:last-child td {
            border-bottom: 2px solid #e0e0e0;
        }

        .highlight-row {
            background: #f0f5ff;
            font-weight: 600;
        }

        .cost-value {
            text-align: right;
        }

        .summary-box {
            background: #f0f5ff;
            border-left: 4px solid #2c5aa0;
            padding: 20px;
            border-radius: 6px;
            margin: 20px 0;
        }

        .summary-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-size: 14px;
        }

        .summary-item:last-child {
            margin-bottom: 0;
            padding-top: 10px;
            border-top: 1px solid rgba(44, 90, 160, 0.2);
            font-weight: 600;
            font-size: 16px;
        }

        .export-options {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }

        .export-card {
            border: 1px solid #e0e0e0;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            cursor: pointer;
            transition: all 0.2s;
        }

        .export-card:hover {
            border-color: #2c5aa0;
            box-shadow: 0 2px 8px rgba(44, 90, 160, 0.15);
        }

        .export-icon {
            font-size: 32px;
            margin-bottom: 10px;
        }

        .export-label {
            font-weight: 600;
            font-size: 14px;
            margin-bottom: 5px;
        }

        .export-desc {
            font-size: 12px;
            color: #666;
        }

        .layout-options {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }

        .layout-card {
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            padding: 15px;
            cursor: pointer;
            transition: all 0.2s;
        }

        .layout-card:hover {
            border-color: #2c5aa0;
            box-shadow: 0 2px 8px rgba(44, 90, 160, 0.15);
        }

        .layout-card.selected {
            border-color: #2c5aa0;
            background: #f0f5ff;
        }

        .layout-preview {
            width: 100%;
            height: 150px;
            background: #fafafa;
            border-radius: 6px;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            color: #999;
        }

        .layout-name {
            font-weight: 600;
            font-size: 14px;
            margin-bottom: 5px;
        }

        .layout-desc {
            font-size: 12px;
            color: #666;
        }

        .disclaimer {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
            font-size: 13px;
            color: #664d03;
        }

        .hidden {
            display: none;
        }

        @media (max-width: 1024px) {
            .content-wrapper {
                grid-template-columns: 1fr;
            }

            .sidebar {
                position: static;
            }

            .form-row {
                grid-template-columns: 1fr;
            }

            .progress-steps {
                flex-wrap: wrap;
            }

            .progress-steps::before {
                display: none;
            }

            .step-label {
                font-size: 11px;
            }
        }

        @media print {
            body {
                background: white;
            }

            .button-group,
            .tab-buttons,
            header {
                display: none;
            }

            .main-panel {
                box-shadow: none;
                border: 1px solid #ddd;
            }
        }

        .unit-toggle {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
        }

        .unit-btn {
            padding: 8px 16px;
            font-size: 12px;
            border: 1px solid #d0d0d0;
            background: white;
            color: #333;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s;
        }

        .unit-btn.active {
            background: #2c5aa0;
            color: white;
            border-color: #2c5aa0;
        }

        .info-box {
            background: #e3f2fd;
            border-left: 4px solid #2196f3;
            padding: 12px;
            border-radius: 4px;
            font-size: 12px;
            color: #0d47a1;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <h1>Home Design & Cost Estimator</h1>
            <p>Professional architectural planning and construction cost estimation</p>
        </div>
    </header>

    <div class="container">
        <!-- Progress Bar -->
        <div class="progress-bar">
            <div class="progress-steps">
                <div class="progress-step active" id="step1-indicator">
                    <div class="step-number">1</div>
                    <div class="step-label">Plot Details</div>
                </div>
                <div class="progress-step" id="step2-indicator">
                    <div class="step-number">2</div>
                    <div class="step-label">Room Layout</div>
                </div>
                <div class="progress-step" id="step3-indicator">
                    <div class="step-number">3</div>
                    <div class="step-label">Design & Cost</div>
                </div>
                <div class="progress-step" id="step4-indicator">
                    <div class="step-number">4</div>
                    <div class="step-label">Review & Export</div>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="content-wrapper">
            <!-- Step 1: Plot Details -->
            <div class="main-panel" id="step1">
                <h2 class="section-title">Step 1: Plot & Site Details</h2>
                
                <div class="unit-toggle">
                    <button class="unit-btn active" onclick="setUnit('ft')">Feet (ft)</button>
                    <button class="unit-btn" onclick="setUnit('m')">Meters (m)</button>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Plot Length (<span id="unit-length">ft</span>)</label>
                        <input type="number" id="plotLength" placeholder="e.g., 50" min="1">
                    </div>
                    <div class="form-group">
                        <label>Plot Width (<span id="unit-width">ft</span>)</label>
                        <input type="number" id="plotWidth" placeholder="e.g., 30" min="1">
                    </div>
                </div>

                <div class="form-group">
                    <label>Plot Area (Auto-calculated) - <span id="plotArea">0</span> <span id="unit-area">sq.ft</span></label>
                    <div class="info-box">Plot area will be calculated automatically based on length and width</div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Plot Facing</label>
                        <select id="plotFacing">
                            <option value="">Select...</option>
                            <option value="north">North</option>
                            <option value="south">South</option>
                            <option value="east">East</option>
                            <option value="west">West</option>
                            <option value="ne">North-East (Corner)</option>
                            <option value="nw">North-West (Corner)</option>
                            <option value="se">South-East (Corner)</option>
                            <option value="sw">South-West (Corner)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Road Width in Front (<span id="unit-road">ft</span>)</label>
                        <input type="number" id="roadWidth" placeholder="e.g., 30" min="0">
                    </div>
                </div>

                <div class="section-title" style="margin-top: 30px;">Setback Requirements</div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Front Setback (<span id="unit-setback-f">ft</span>)</label>
                        <input type="number" id="setbackFront" placeholder="e.g., 20" min="0">
                        <div class="hint-text">Auto-suggest: Check local bylaws or enter manually</div>
                    </div>
                    <div class="form-group">
                        <label>Rear Setback (<span id="unit-setback-r">ft</span>)</label>
                        <input type="number" id="setbackRear" placeholder="e.g., 15" min="0">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Left Setback (<span id="unit-setback-l">ft</span>)</label>
                        <input type="number" id="setbackLeft" placeholder="e.g., 5" min="0">
                    </div>
                    <div class="form-group">
                        <label>Right Setback (<span id="unit-setback-r2">ft</span>)</label>
                        <input type="number" id="setbackRight" placeholder="e.g., 5" min="0">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Number of Floors</label>
                        <select id="numFloors">
                            <option value="G">Ground Floor (G)</option>
                            <option value="G+1">Ground + 1 (G+1)</option>
                            <option value="G+2">Ground + 2 (G+2)</option>
                            <option value="G+3">Ground + 3 (G+3)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Vastu Compliance</label>
                        <div class="radio-group">
                            <div class="radio-item">
                                <input type="radio" id="vastu-yes" name="vastu" value="yes">
                                <label for="vastu-yes">Yes</label>
                            </div>
                            <div class="radio-item">
                                <input type="radio" id="vastu-no" name="vastu" value="no" checked>
                                <label for="vastu-no">No</label>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <label>City / State</label>
                    <input type="text" id="location" placeholder="e.g., Bangalore, Karnataka">
                    <div class="hint-text">Used for local cost rate adjustments</div>
                </div>

                <div class="button-group">
                    <button class="btn-primary" onclick="nextStep(2)">Continue to Room Layout →</button>
                </div>
            </div>

            <!-- Step 2: Room Layout -->
            <div class="main-panel hidden" id="step2">
                <h2 class="section-title">Step 2: Room & Layout Requirements</h2>

                <div class="section-title" style="margin-top: 0;">Basic Requirements</div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Number of Bedrooms</label>
                        <input type="number" id="bedrooms" value="2" min="1" max="8">
                    </div>
                    <div class="form-group">
                        <label>Number of Bathrooms/Toilets</label>
                        <input type="number" id="bathrooms" value="2" min="1" max="8">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Kitchen Type</label>
                        <select id="kitchenType">
                            <option value="open">Open Kitchen</option>
                            <option value="closed">Closed/Modular Kitchen</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Number of Parking Spaces</label>
                        <input type="number" id="parking" value="1" min="0" max="5">
                    </div>
                </div>

                <div class="section-title">Optional Rooms</div>

                <div class="checkbox-group">
                    <div class="checkbox-item">
                        <input type="checkbox" id="hasLiving" checked>
                        <label for="hasLiving">Living/Drawing Room</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="hasDining" checked>
                        <label for="hasDining">Dining Area</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="hasPooja">
                        <label for="hasPooja">Pooja Room</label>
                    </div>
                </div>

                <div class="checkbox-group">
                    <div class="checkbox-item">
                        <input type="checkbox" id="hasStudy">
                        <label for="hasStudy">Study/Home Office</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="hasServant">
                        <label for="hasServant">Servant Room/Store</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="hasTerrace">
                        <label for="hasTerrace">Terrace/Roof Garden</label>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Number of Balconies</label>
                        <input type="number" id="balconies" value="1" min="0" max="5">
                    </div>
                    <div class="form-group">
                        <label>Staircase Location Preference</label>
                        <select id="staircaseLocation">
                            <option value="central">Central</option>
                            <option value="side">Side</option>
                            <option value="corner">Corner</option>
                        </select>
                    </div>
                </div>

                <div class="button-group">
                    <button class="btn-secondary" onclick="prevStep(1)">← Back to Plot Details</button>
                    <button class="btn-primary" onclick="nextStep(3)">Continue to Design & Cost →</button>
                </div>
            </div>

            <!-- Step 3: Design & Cost -->
            <div class="main-panel hidden" id="step3">
                <h2 class="section-title">Step 3: Design Style & Construction Preferences</h2>

                <div class="form-row">
                    <div class="form-group">
                        <label>Architectural Style</label>
                        <select id="archStyle">
                            <option value="modern">Modern</option>
                            <option value="traditional">Traditional/Indian</option>
                            <option value="contemporary">Contemporary</option>
                            <option value="minimalist">Minimalist</option>
                            <option value="colonial">Colonial</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Construction Type</label>
                        <select id="constructionType">
                            <option value="rcc">RCC Framed Structure</option>
                            <option value="loadbearing">Load-Bearing</option>
                        </select>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Wall Material</label>
                        <select id="wallMaterial">
                            <option value="brick">Brick</option>
                            <option value="aac">AAC Block</option>
                            <option value="concrete">Concrete</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Flooring Preference</label>
                        <select id="flooring">
                            <option value="tiles">Ceramic Tiles</option>
                            <option value="marble">Marble</option>
                            <option value="vitrified">Vitrified</option>
                            <option value="wood">Wood/Laminate</option>
                        </select>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Roofing Type</label>
                        <select id="roofing">
                            <option value="flat-rcc">Flat RCC</option>
                            <option value="sloped">Sloped/Tiled</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Quality Grade</label>
                        <select id="qualityGrade">
                            <option value="basic">Basic</option>
                            <option value="standard">Standard</option>
                            <option value="premium">Premium</option>
                            <option value="luxury">Luxury</option>
                        </select>
                    </div>
                </div>

                <div class="section-title" style="margin-top: 30px;">Budget</div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Budget Min (₹ per sq.ft)</label>
                        <input type="number" id="budgetMin" placeholder="e.g., 800" min="0">
                        <div class="hint-text">Typical range: ₹600–1500/sq.ft in India</div>
                    </div>
                    <div class="form-group">
                        <label>Budget Max (₹ per sq.ft)</label>
                        <input type="number" id="budgetMax" placeholder="e.g., 1500" min="0">
                    </div>
                </div>

                <!-- Loading State -->
                <div class="loading-state hidden" id="loadingState">
                    <div class="spinner"></div>
                    <p>Generating floor plan and 3D design...</p>
                </div>

                <!-- Floor Plan Display -->
                <div id="planSection" class="hidden">
                    <div class="section-title" style="margin-top: 30px;">Generated Floor Plan</div>
                    
                    <div class="tab-container">
                        <div class="tab-buttons">
                            <button class="tab-button active" onclick="switchTab('plan', this)">2D Floor Plan</button>
                            <button class="tab-button" onclick="switchTab('3d', this)">3D View</button>
                            <button class="tab-button" onclick="switchTab('layouts', this)">Layout Options</button>
                        </div>

                        <div class="tab-content active" id="tab-plan">
                            <div class="plan-container">
                                <canvas id="planCanvas" class="plan-canvas"></canvas>
                            </div>
                            <div style="text-align: center; margin-top: 10px;">
                                <small style="color: #999;">2D Floor Plan - Scaled Drawing</small>
                            </div>
                        </div>

                        <div class="tab-content" id="tab-3d">
                            <div id="threeDContainer"></div>
                            <div style="text-align: center; margin-top: 10px;">
                                <small style="color: #999;">3D Exterior View</small>
                            </div>
                        </div>

                        <div class="tab-content" id="tab-layouts">
                            <div class="layout-options" id="layoutOptions"></div>
                        </div>
                    </div>

                    <button class="btn-secondary" onclick="regenerateDesign()" style="margin-top: 20px;">🔄 Regenerate Layout</button>
                </div>

                <div class="button-group" style="margin-top: 40px;">
                    <button class="btn-secondary" onclick="prevStep(2)">← Back to Room Layout</button>
                    <button class="btn-primary" onclick="generateDesign()">Generate Design & Cost Estimate</button>
                </div>
            </div>

            <!-- Step 4: Review & Export -->
            <div class="main-panel hidden" id="step4">
                <h2 class="section-title">Step 4: Review & Export</h2>

                <div class="tab-container">
                    <div class="tab-buttons">
                        <button class="tab-button active" onclick="switchTab('cost', this)">Cost Estimate</button>
                        <button class="tab-button" onclick="switchTab('summary', this)">Project Summary</button>
                        <button class="tab-button" onclick="switchTab('export', this)">Export Options</button>
                    </div>

                    <div class="tab-content active" id="tab-cost">
                        <div class="section-title">Room-wise Area Breakdown</div>
                        <table id="areaTable">
                            <thead>
                                <tr>
                                    <th>Room Type</th>
                                    <th>Quantity</th>
                                    <th>Size (Avg <span id="unit-table">sq.ft</span>)</th>
                                    <th>Total Area</th>
                                </tr>
                            </thead>
                            <tbody id="areaTableBody">
                            </tbody>
                        </table>

                        <div class="section-title" style="margin-top: 30px;">Material-wise Cost Breakdown</div>
                        <table id="costTable">
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Quantity/Unit</th>
                                    <th>Rate</th>
                                    <th>Total Cost</th>
                                </tr>
                            </thead>
                            <tbody id="costTableBody">
                            </tbody>
                        </table>

                        <div class="summary-box">
                            <div class="summary-item">
                                <span>Built-up Area:</span>
                                <strong id="totalArea">0</strong>
                            </div>
                            <div class="summary-item">
                                <span>Construction Type:</span>
                                <strong id="summaryConstType">—</strong>
                            </div>
                            <div class="summary-item">
                                <span>Quality Grade:</span>
                                <strong id="summaryQuality">—</strong>
                            </div>
                            <div class="summary-item">
                                <span>Rate per sq.ft:</span>
                                <strong id="ratePerSqft">—</strong>
                            </div>
                            <div class="summary-item">
                                <span>TOTAL ESTIMATED COST:</span>
                                <strong id="totalCost" style="color: #2c5aa0;">—</strong>
                            </div>
                        </div>

                        <div class="disclaimer">
                            <strong>⚠ Disclaimer:</strong> This is a preliminary/conceptual design and cost estimate. Before construction, it must be:
                            <ul style="margin-top: 10px; margin-left: 20px;">
                                <li>Verified and stamped by a licensed architect</li>
                                <li>Approved by structural engineer</li>
                                <li>Submitted to local municipal authorities for approvals</li>
                                <li>Adjusted based on actual site conditions and material rates</li>
                            </ul>
                        </div>
                    </div>

                    <div class="tab-content" id="tab-summary">
                        <div class="summary-box">
                            <div class="summary-item">
                                <span>Plot Length:</span>
                                <strong id="sumPlotLength">—</strong>
                            </div>
                            <div class="summary-item">
                                <span>Plot Width:</span>
                                <strong id="sumPlotWidth">—</strong>
                            </div>
                            <div class="summary-item">
                                <span>Plot Area:</span>
                                <strong id="sumPlotArea">—</strong>
                            </div>
                            <div class="summary-item">
                                <span>Built-up Area:</span>
                                <strong id="sumBuiltArea">—</strong>
                            </div>
                            <div class="summary-item">
                                <span>Plot Coverage:</span>
                                <strong id="sumCoverage">—</strong>
                            </div>
                            <div class="summary-item">
                                <span>Number of Floors:</span>
                                <strong id="sumFloors">—</strong>
                            </div>
                            <div class="summary-item">
                                <span>Bedrooms:</span>
                                <strong id="sumBeds">—</strong>
                            </div>
                            <div class="summary-item">
                                <span>Bathrooms:</span>
                                <strong id="sumBaths">—</strong>
                            </div>
                            <div class="summary-item">
                                <span>Estimated Cost:</span>
                                <strong id="sumCost" style="color: #2c5aa0;">—</strong>
                            </div>
                        </div>
                    </div>

                    <div class="tab-content" id="tab-export">
                        <div class="section-title">Download & Export Options</div>
                        <div class="export-options">
                            <div class="export-card" onclick="exportPDF()">
                                <div class="export-icon">📄</div>
                                <div class="export-label">Complete PDF Report</div>
                                <div class="export-desc">Plan + 3D view + Cost estimate + Summary</div>
                            </div>
                            <div class="export-card" onclick="exportDWG()">
                                <div class="export-icon">📐</div>
                                <div class="export-label">DWG File</div>
                                <div class="export-desc">AutoCAD format for architects</div>
                            </div>
                            <div class="export-card" onclick="exportCSV()">
                                <div class="export-icon">📊</div>
                                <div class="export-label">Cost Estimate (CSV)</div>
                                <div class="export-desc">Excel-compatible spreadsheet</div>
                            </div>
                            <div class="export-card" onclick="printProject()">
                                <div class="export-icon">🖨️</div>
                                <div class="export-label">Print Report</div>
                                <div class="export-desc">Print-ready high-quality layout</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="button-group" style="margin-top: 40px;">
                    <button class="btn-secondary" onclick="prevStep(3)">← Back to Design</button>
                    <button class="btn-primary" onclick="saveProject()">💾 Save Project</button>
                </div>
            </div>
        </div>
    </div>

    <script>
        // ===== Global State =====
        let currentStep = 1;
        let currentUnit = 'ft';
        let projectData = {};
        let generatedPlan = null;
        let scene = null;
        let camera = null;
        let renderer = null;

        // ===== Unit Conversion =====
        function setUnit(unit) {
            currentUnit = unit;
            
            // Update button states
            document.querySelectorAll('.unit-btn').forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');

            // Update unit labels
            const unitLabel = unit === 'ft' ? 'ft' : 'm';
            const areaUnit = unit === 'ft' ? 'sq.ft' : 'sq.m';
            
            document.querySelectorAll('#unit-length, #unit-width, #unit-road, #unit-setback-f, #unit-setback-r, #unit-setback-l, #unit-setback-r2, #unit-table').forEach(el => {
                el.textContent = unitLabel;
            });
            document.querySelector('#unit-area').textContent = areaUnit;

            calculatePlotArea();
        }

        // ===== Plot Area Calculation =====
        function calculatePlotArea() {
            const length = parseFloat(document.getElementById('plotLength').value) || 0;
            const width = parseFloat(document.getElementById('plotWidth').value) || 0;
            const area = (length * width).toFixed(2);
            document.getElementById('plotArea').textContent = area;
        }

        // ===== Step Navigation =====
        function nextStep(step) {
            if (step === 2 && !validateStep1()) return;
            if (step === 3 && !validateStep2()) return;
            
            showStep(step);
            currentStep = step;
        }

        function prevStep(step) {
            showStep(step);
            currentStep = step;
        }

        function showStep(step) {
            // Hide all steps
            document.querySelectorAll('.main-panel').forEach(panel => {
                panel.classList.add('hidden');
            });

            // Show current step
            document.getElementById(`step${step}`).classList.remove('hidden');

            // Update progress indicators
            document.querySelectorAll('.progress-step').forEach((s, idx) => {
                s.classList.remove('active', 'completed');
                if (idx + 1 < step) {
                    s.classList.add('completed');
                } else if (idx + 1 === step) {
                    s.classList.add('active');
                }
            });

            window.scrollTo(0, 0);
        }

        // ===== Validation =====
        function validateStep1() {
            const errors = [];
            if (!document.getElementById('plotLength').value) errors.push('Plot Length required');
            if (!document.getElementById('plotWidth').value) errors.push('Plot Width required');
            if (!document.getElementById('plotFacing').value) errors.push('Plot Facing required');

            if (errors.length) {
                alert('Please fill:\n' + errors.join('\n'));
                return false;
            }
            return true;
        }

        function validateStep2() {
            const errors = [];
            if (!document.getElementById('bedrooms').value) errors.push('Bedrooms required');
            if (!document.getElementById('bathrooms').value) errors.push('Bathrooms required');

            if (errors.length) {
                alert('Please fill:\n' + errors.join('\n'));
                return false;
            }
            return true;
        }

        // ===== Generate Design =====
        function generateDesign() {
            // Collect form data
            projectData = {
                // Plot Details
                plotLength: parseFloat(document.getElementById('plotLength').value),
                plotWidth: parseFloat(document.getElementById('plotWidth').value),
                plotArea: parseFloat(document.getElementById('plotArea').textContent),
                plotFacing: document.getElementById('plotFacing').value,
                roadWidth: parseFloat(document.getElementById('roadWidth').value) || 0,
                setback: {
                    front: parseFloat(document.getElementById('setbackFront').value) || 20,
                    rear: parseFloat(document.getElementById('setbackRear').value) || 15,
                    left: parseFloat(document.getElementById('setbackLeft').value) || 5,
                    right: parseFloat(document.getElementById('setbackRight').value) || 5
                },
                floors: document.getElementById('numFloors').value,
                vastu: document.querySelector('input[name="vastu"]:checked').value,
                location: document.getElementById('location').value,

                // Room Details
                bedrooms: parseInt(document.getElementById('bedrooms').value),
                bathrooms: parseInt(document.getElementById('bathrooms').value),
                parking: parseInt(document.getElementById('parking').value),
                kitchenType: document.getElementById('kitchenType').value,
                balconies: parseInt(document.getElementById('balconies').value),
                hasLiving: document.getElementById('hasLiving').checked,
                hasDining: document.getElementById('hasDining').checked,
                hasPooja: document.getElementById('hasPooja').checked,
                hasStudy: document.getElementById('hasStudy').checked,
                hasServant: document.getElementById('hasServant').checked,
                hasTerrace: document.getElementById('hasTerrace').checked,
                staircaseLocation: document.getElementById('staircaseLocation').value,

                // Design Preferences
                archStyle: document.getElementById('archStyle').value,
                constructionType: document.getElementById('constructionType').value,
                wallMaterial: document.getElementById('wallMaterial').value,
                flooring: document.getElementById('flooring').value,
                roofing: document.getElementById('roofing').value,
                qualityGrade: document.getElementById('qualityGrade').value,
                budgetMin: parseFloat(document.getElementById('budgetMin').value) || 800,
                budgetMax: parseFloat(document.getElementById('budgetMax').value) || 1500,

                unit: currentUnit
            };

            // Show loading state
            document.getElementById('loadingState').classList.remove('hidden');
            document.getElementById('planSection').classList.add('hidden');

            // Simulate AI generation delay
            setTimeout(() => {
                generateFloorPlan();
                generate3DView();
                generateLayoutOptions();
                calculateCost();

                document.getElementById('loadingState').classList.add('hidden');
                document.getElementById('planSection').classList.remove('hidden');

                nextStep(4);
            }, 1500);
        }

        // ===== Generate Floor Plan (2D Canvas) =====
        function generateFloorPlan() {
            const canvas = document.getElementById('planCanvas');
            const ctx = canvas.getContext('2d');

            // Set canvas size
            canvas.width = 600;
            canvas.height = 600;

            // Clear canvas
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Calculate usable area (considering setbacks)
            const plotL = projectData.plotLength;
            const plotW = projectData.plotWidth;
            const usableLength = plotL - (projectData.setback.front + projectData.setback.rear);
            const usableWidth = plotW - (projectData.setback.left + projectData.setback.right);

            // Scale to fit canvas
            const scale = Math.min(500 / usableLength, 500 / usableWidth);

            // Draw plot boundary
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 2;
            ctx.strokeRect(50, 50, usableLength * scale, usableWidth * scale);

            // Draw grid
            ctx.strokeStyle = '#e0e0e0';
            ctx.lineWidth = 0.5;
            for (let i = 0; i <= 10; i++) {
                const x = 50 + (i / 10) * usableLength * scale;
                const y = 50 + (i / 10) * usableWidth * scale;
                ctx.beginPath();
                ctx.moveTo(x, 50);
                ctx.lineTo(x, 50 + usableWidth * scale);
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(50, y);
                ctx.lineTo(50 + usableLength * scale, y);
                ctx.stroke();
            }

            // Draw rooms (simplified layout)
            drawRooms(ctx, scale, usableLength, usableWidth);

            // Draw dimensions
            ctx.fillStyle = '#666';
            ctx.font = '12px Roboto';
            ctx.textAlign = 'center';
            ctx.fillText(`${usableLength.toFixed(1)} ${projectData.unit}`, 50 + usableLength * scale / 2, 30);
            ctx.textAlign = 'right';
            ctx.fillText(`${usableWidth.toFixed(1)} ${projectData.unit}`, 570, 50 + usableWidth * scale / 2);

            // Title
            ctx.fillStyle = '#000';
            ctx.font = 'bold 16px Roboto';
            ctx.textAlign = 'left';
            ctx.fillText('Ground Floor Plan', 50, 580);
        }

        function drawRooms(ctx, scale, width, height) {
            const roomWidth = width * scale / 3;
            const roomHeight = height * scale / 2;
            const startX = 50;
            const startY = 50;

            // Bedroom 1
            ctx.fillStyle = '#e3f2fd';
            ctx.fillRect(startX, startY, roomWidth, roomHeight);
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(startX, startY, roomWidth, roomHeight);
            ctx.fillStyle = '#2c5aa0';
            ctx.font = '12px Roboto';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('Bedroom 1', startX + roomWidth / 2, startY + roomHeight / 2 - 10);
            ctx.fillText(`${(roomWidth / scale).toFixed(0)} x ${(roomHeight / scale).toFixed(0)} ft`, startX + roomWidth / 2, startY + roomHeight / 2 + 10);

            // Bedroom 2
            ctx.fillRect(startX + roomWidth, startY, roomWidth, roomHeight);
            ctx.strokeRect(startX + roomWidth, startY, roomWidth, roomHeight);
            ctx.fillText('Bedroom 2', startX + 1.5 * roomWidth, startY + roomHeight / 2 - 10);

            // Living Room
            ctx.fillStyle = '#f0f4ff';
            ctx.fillRect(startX + 2 * roomWidth, startY, roomWidth, roomHeight);
            ctx.strokeRect(startX + 2 * roomWidth, startY, roomWidth, roomHeight);
            ctx.fillStyle = '#2c5aa0;
            ctx.fillText('Living', startX + 2.5 * roomWidth, startY + roomHeight / 2 - 10);

            // Kitchen
            ctx.fillStyle = '#fff3cd';
            ctx.fillRect(startX, startY + roomHeight, roomWidth, roomHeight);
            ctx.strokeRect(startX, startY + roomHeight, roomWidth, roomHeight);
            ctx.fillStyle = '#856404';
            ctx.fillText('Kitchen', startX + roomWidth / 2, startY + 1.5 * roomHeight);

            // Bathroom
            ctx.fillStyle = '#e8f5e9';
            ctx.fillRect(startX + roomWidth, startY + roomHeight, roomWidth / 2, roomHeight / 2);
            ctx.strokeRect(startX + roomWidth, startY + roomHeight, roomWidth / 2, roomHeight / 2);
            ctx.fillStyle = '#1b5e20';
            ctx.font = '10px Roboto';
            ctx.fillText('Bath', startX + roomWidth + roomWidth / 4, startY + roomHeight + roomHeight / 4);

            // Staircase
            ctx.fillStyle = '#fce4ec';
            ctx.fillRect(startX + roomWidth + roomWidth / 2, startY + roomHeight, roomWidth / 2, roomHeight / 2);
            ctx.strokeRect(startX + roomWidth + roomWidth / 2, startY + roomHeight, roomWidth / 2, roomHeight / 2);
            ctx.fillStyle = '#c2185b';
            ctx.fillText('Stair', startX + roomWidth + roomWidth * 3 / 4, startY + roomHeight + roomHeight / 4);

            // Dining
            ctx.fillStyle = '#f3e5f5';
            ctx.fillRect(startX + 2 * roomWidth, startY + roomHeight, roomWidth, roomHeight);
            ctx.strokeRect(startX + 2 * roomWidth, startY + roomHeight, roomWidth, roomHeight);
            ctx.fillStyle = '#4a148c';
            ctx.fillText('Dining', startX + 2.5 * roomWidth, startY + 1.5 * roomHeight);
        }

        // ===== Generate 3D View =====
        function generate3DView() {
            const container = document.getElementById('threeDContainer');
            container.innerHTML = ''; // Clear

            // Initialize Three.js
            const width = container.clientWidth;
            const height = container.clientHeight;

            scene = new THREE.Scene();
            scene.background = new THREE.Color(0xf5f5f5);

            camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
            camera.position.set(20, 15, 20);
            camera.lookAt(0, 0, 0);

            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(width, height);
            renderer.shadowMap.enabled = true;
            container.appendChild(renderer.domElement);

            // Add lighting
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
            scene.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
            directionalLight.position.set(10, 20, 10);
            directionalLight.castShadow = true;
            directionalLight.shadow.mapSize.width = 2048;
            directionalLight.shadow.mapSize.height = 2048;
            scene.add(directionalLight);

            // Draw ground
            const groundGeometry = new THREE.PlaneGeometry(50, 50);
            const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x90ee90 });
            const ground = new THREE.Mesh(groundGeometry, groundMaterial);
            ground.rotation.x = -Math.PI / 2;
            ground.receiveShadow = true;
            scene.add(ground);

            // Draw building
            const buildingWidth = projectData.plotWidth * 0.6;
            const buildingLength = projectData.plotLength * 0.8;
            const buildingHeight = projectData.floors === 'G' ? 12 : projectData.floors === 'G+1' ? 20 : projectData.floors === 'G+2' ? 28 : 36;

            // Main walls
            const wallGeometry = new THREE.BoxGeometry(buildingLength, buildingHeight, buildingWidth);
            const wallMaterial = new THREE.MeshLambertMaterial({ color: 0xd4a574 }); // Beige/cream
            const building = new THREE.Mesh(wallGeometry, wallMaterial);
            building.position.y = buildingHeight / 2;
            building.castShadow = true;
            building.receiveShadow = true;
            scene.add(building);

            // Roof
            const roofGeometry = new THREE.ConeGeometry(Math.sqrt(buildingLength ** 2 + buildingWidth ** 2) / 2, 3, 4);
            const roofMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 }); // Brown
            const roof = new THREE.Mesh(roofGeometry, roofMaterial);
            roof.position.y = buildingHeight;
            roof.rotation.z = Math.PI / 4;
            roof.castShadow = true;
            scene.add(roof);

            // Windows
            const windowGeometry = new THREE.BoxGeometry(2, 2, 0.1);
            const windowMaterial = new THREE.MeshLambertMaterial({ color: 0x87ceeb }); // Sky blue

            for (let i = 0; i < 5; i++) {
                for (let j = 0; j < 3; j++) {
                    const window1 = new THREE.Mesh(windowGeometry, windowMaterial);
                    window1.position.set(-buildingLength / 2.5 + i * 3, 3 + j * 4, buildingWidth / 2 + 0.05);
                    window1.castShadow = true;
                    scene.add(window1);

                    const window2 = new THREE.Mesh(windowGeometry, windowMaterial);
                    window2.position.set(-buildingLength / 2.5 + i * 3, 3 + j * 4, -buildingWidth / 2 - 0.05);
                    window2.castShadow = true;
                    scene.add(window2);
                }
            }

            // Door
            const doorGeometry = new THREE.BoxGeometry(2, 3, 0.1);
            const doorMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 }); // Brown
            const door = new THREE.Mesh(doorGeometry, doorMaterial);
            door.position.set(0, 1.5, buildingWidth / 2 + 0.05);
            door.castShadow = true;
            scene.add(door);

            // Animate
            function animate() {
                requestAnimationFrame(animate);
                building.rotation.y += 0.005;
                roof.rotation.y += 0.005;
                renderer.render(scene, camera);
            }
            animate();
        }

        // ===== Generate Layout Options =====
        function generateLayoutOptions() {
            const container = document.getElementById('layoutOptions');
            container.innerHTML = '';

            const layouts = [
                {
                    name: 'L-Shaped',
                    desc: 'Classic L-shaped design with corner placement',
                    type: 'l-shaped'
                },
                {
                    name: 'Linear',
                    desc: 'Sequential rooms along main axis',
                    type: 'linear'
                },
                {
                    name: 'Central Court',
                    desc: 'Rooms around central courtyard (Vastu-style)',
                    type: 'courtyard'
                }
            ];

            layouts.forEach((layout, idx) => {
                const card = document.createElement('div');
                card.className = 'layout-card' + (idx === 0 ? ' selected' : '');
                card.onclick = () => selectLayout(card);
                card.innerHTML = `
                    <div class="layout-preview">
                        ${['L', 'I', 'C'][idx]}-Shape Layout
                    </div>
                    <div class="layout-name">${layout.name}</div>
                    <div class="layout-desc">${layout.desc}</div>
                `;
                container.appendChild(card);
            });
        }

        function selectLayout(card) {
            document.querySelectorAll('.layout-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
        }

        function regenerateDesign() {
            document.getElementById('loadingState').classList.remove('hidden');
            document.getElementById('planSection').classList.add('hidden');

            setTimeout(() => {
                generateFloorPlan();
                generate3DView();
                generateLayoutOptions();

                document.getElementById('loadingState').classList.add('hidden');
                document.getElementById('planSection').classList.remove('hidden');
            }, 1500);
        }

        // ===== Tab Switching =====
        function switchTab(tabName, button) {
            // Hide all tabs
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });

            // Deactivate all buttons
            document.querySelectorAll('.tab-button').forEach(btn => {
                btn.classList.remove('active');
            });

            // Show selected tab
            document.getElementById(`tab-${tabName}`).classList.add('active');
            button.classList.add('active');

            // Re-render 3D if needed
            if (tabName === '3d' && renderer) {
                renderer.render(scene, camera);
            }
        }

        // ===== Cost Calculation =====
        function calculateCost() {
            // Calculate built-up area (simple approximation)
            const usableLength = projectData.plotLength - (projectData.setback.front + projectData.setback.rear);
            const usableWidth = projectData.plotWidth - (projectData.setback.left + projectData.setback.right);
            const builtupPerFloor = usableLength * usableWidth * 0.85; // 85% coverage
            const numFloors = projectData.floors === 'G' ? 1 : projectData.floors === 'G+1' ? 2 : projectData.floors === 'G+2' ? 3 : 4;
            const totalBuiltup = builtupPerFloor * numFloors;

            // Estimate room areas
            const roomAreas = {
                'Master Bedroom': 150,
                'Bedroom': 120,
                'Bathroom': 50,
                'Kitchen': 120,
                'Living Room': 250,
                'Dining Area': 120,
                'Staircase': 60,
                'Balcony': 60,
                'Pooja Room': 80,
                'Study': 100,
                'Servant Room': 100
            };

            // Build area table
            const areaTableBody = document.getElementById('areaTableBody');
            areaTableBody.innerHTML = '';

            let totalRoomArea = 0;

            if (projectData.bedrooms > 0) {
                const masterArea = 150;
                const otherArea = 120;
                let html = `
                    <tr>
                        <td>Master Bedroom</td>
                        <td>1</td>
                        <td>150</td>
                        <td>150</td>
                    </tr>
                `;
                totalRoomArea += 150;

                if (projectData.bedrooms > 1) {
                    html += `
                        <tr>
                            <td>Bedroom(s)</td>
                            <td>${projectData.bedrooms - 1}</td>
                            <td>120</td>
                            <td>${(projectData.bedrooms - 1) * 120}</td>
                        </tr>
                    `;
                    totalRoomArea += (projectData.bedrooms - 1) * 120;
                }

                areaTableBody.innerHTML += html;
            }

            if (projectData.bathrooms > 0) {
                areaTableBody.innerHTML += `
                    <tr>
                        <td>Bathroom(s)</td>
                        <td>${projectData.bathrooms}</td>
                        <td>50</td>
                        <td>${projectData.bathrooms * 50}</td>
                    </tr>
                `;
                totalRoomArea += projectData.bathrooms * 50;
            }

            if (projectData.hasLiving) {
                areaTableBody.innerHTML += `
                    <tr>
                        <td>Living Room</td>
                        <td>1</td>
                        <td>250</td>
                        <td>250</td>
                    </tr>
                `;
                totalRoomArea += 250;
            }

            if (projectData.hasDining) {
                areaTableBody.innerHTML += `
                    <tr>
                        <td>Dining Area</td>
                        <td>1</td>
                        <td>120</td>
                        <td>120</td>
                    </tr>
                `;
                totalRoomArea += 120;
            }

            areaTableBody.innerHTML += `
                <tr>
                    <td>Kitchen</td>
                    <td>1</td>
                    <td>120</td>
                    <td>120</td>
                </tr>
            `;
            totalRoomArea += 120;

            if (projectData.hasPooja) {
                areaTableBody.innerHTML += `
                    <tr>
                        <td>Pooja Room</td>
                        <td>1</td>
                        <td>80</td>
                        <td>80</td>
                    </tr>
                `;
                totalRoomArea += 80;
            }

            areaTableBody.innerHTML += `
                <tr>
                    <td>Staircase</td>
                    <td>1</td>
                    <td>60</td>
                    <td>60</td>
                </tr>
            `;
            totalRoomArea += 60;

            areaTableBody.innerHTML += `
                <tr class="highlight-row">
                    <td>TOTAL BUILT-UP AREA</td>
                    <td>—</td>
                    <td>—</td>
                    <td>${totalRoomArea.toFixed(0)} ${currentUnit === 'ft' ? 'sq.ft' : 'sq.m'}</td>
                </tr>
            `;

            // Cost calculation
            const rateQualityMultiplier = {
                'basic': 0.8,
                'standard': 1.0,
                'premium': 1.5,
                'luxury': 2.0
            };

            const baseRate = (projectData.budgetMin + projectData.budgetMax) / 2;
            const qualityMultiplier = rateQualityMultiplier[projectData.qualityGrade] || 1.0;
            const finalRate = baseRate * qualityMultiplier;

            // Material cost breakdown
            const costsData = [
                { item: 'Cement & Concrete', qty: Math.round(totalRoomArea / 10), unit: 'bags', rate: 400 },
                { item: 'Steel (TMT Bars)', qty: Math.round(totalRoomArea / 20), unit: 'quintals', rate: 45000 },
                { item: 'Bricks/AAC Blocks', qty: Math.round(totalRoomArea / 5), unit: 'thousand', rate: 4000 },
                { item: 'Sand & Aggregate', qty: Math.round(totalRoomArea / 8), unit: 'cum', rate: 500 },
                { item: 'Flooring (Tiles)', qty: totalRoomArea, unit: 'sq.ft', rate: 80 },
                { item: 'Wall Painting', qty: totalRoomArea * 2, unit: 'sq.ft', rate: 30 },
                { item: 'Electrical Works', qty: 1, unit: 'lot', rate: finalRate * totalRoomArea * 0.08 },
                { item: 'Plumbing Works', qty: 1, unit: 'lot', rate: finalRate * totalRoomArea * 0.06 },
                { item: 'Doors & Windows', qty: projectData.bedrooms + projectData.bathrooms + 5, unit: 'units', rate: 5000 },
                { item: 'Miscellaneous', qty: 1, unit: 'lot', rate: finalRate * totalRoomArea * 0.1 }
            ];

            const costTableBody = document.getElementById('costTableBody');
            costTableBody.innerHTML = '';

            let totalCost = 0;
            costsData.forEach(cost => {
                const itemCost = cost.qty * cost.rate;
                totalCost += itemCost;
                costTableBody.innerHTML += `
                    <tr>
                        <td>${cost.item}</td>
                        <td>${cost.qty.toFixed(0)} ${cost.unit}</td>
                        <td>₹${cost.rate.toFixed(0)}</td>
                        <td class="cost-value">₹${itemCost.toFixed(0)}</td>
                    </tr>
                `;
            });

            const laborCost = totalCost * 0.15; // 15% labor
            totalCost += laborCost;

            costTableBody.innerHTML += `
                <tr>
                    <td>Labor Cost (estimated 15%)</td>
                    <td>—</td>
                    <td>—</td>
                    <td class="cost-value">₹${laborCost.toFixed(0)}</td>
                </tr>
                <tr class="highlight-row">
                    <td>TOTAL ESTIMATED COST</td>
                    <td>—</td>
                    <td>—</td>
                    <td class="cost-value">₹${totalCost.toFixed(0)}</td>
                </tr>
            `;

            // Update summary
            document.getElementById('totalArea').textContent = `${totalRoomArea.toFixed(0)} ${currentUnit === 'ft' ? 'sq.ft' : 'sq.m'}`;
            document.getElementById('summaryConstType').textContent = projectData.constructionType === 'rcc' ? 'RCC Framed' : 'Load-Bearing';
            document.getElementById('summaryQuality').textContent = projectData.qualityGrade.charAt(0).toUpperCase() + projectData.qualityGrade.slice(1);
            document.getElementById('ratePerSqft').textContent = `₹${finalRate.toFixed(0)}`;
            document.getElementById('totalCost').textContent = `₹${totalCost.toFixed(0)}`;

            // Update project summary
            const plotArea = parseFloat(document.getElementById('plotArea').textContent);
            const coverage = ((totalRoomArea / plotArea) * 100).toFixed(1);

            document.getElementById('sumPlotLength').textContent = `${projectData.plotLength} ${currentUnit}`;
            document.getElementById('sumPlotWidth').textContent = `${projectData.plotWidth} ${currentUnit}`;
            document.getElementById('sumPlotArea').textContent = `${plotArea} ${currentUnit === 'ft' ? 'sq.ft' : 'sq.m'}`;
            document.getElementById('sumBuiltArea').textContent = `${totalRoomArea.toFixed(0)} ${currentUnit === 'ft' ? 'sq.ft' : 'sq.m'}`;
            document.getElementById('sumCoverage').textContent = `${coverage}%`;
            document.getElementById('sumFloors').textContent = projectData.floors;
            document.getElementById('sumBeds').textContent = projectData.bedrooms;
            document.getElementById('sumBaths').textContent = projectData.bathrooms;
            document.getElementById('sumCost').textContent = `₹${totalCost.toFixed(0)}`;

            // Store for export
            projectData.totalBuiltup = totalRoomArea;
            projectData.totalCost = totalCost;
            projectData.finalRate = finalRate;
        }

        // ===== Export Functions =====
        function exportPDF() {
            const element = document.querySelector('.main-panel:not(.hidden)');
            const opt = {
                margin: 10,
                filename: 'Home-Design-Report.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
            };
            html2pdf().set(opt).from(element).save();
        }

        function exportDWG() {
            alert('DWG export feature:\n\nNote: Full DWG generation requires specialized libraries.\n\nFor production use, integrate with libraries like:\n- dxf-writer (Node.js)\n- LibreDXF\n\nThe 2D floor plan can be converted to DWG using online tools or AutoCAD itself.');
            
            // Simulate download
            const mockDWGData = generateMockDWG();
            downloadFile(mockDWGData, 'FloorPlan.dxf', 'text/plain');
        }

        function generateMockDWG() {
            return `0
SECTION
2
ENTITIES
0
LINE
8
0
10
0
20
0
11
100
21
0
0
LINE
8
0
10
100
20
0
11
100
21
100
0
LINE
8
0
10
100
20
100
11
0
21
100
0
LINE
8
0
10
0
20
100
11
0
21
0
0
ENDSEC
0
EOF`;
        }

        function exportCSV() {
            let csv = 'Item,Quantity,Unit,Rate,Total Cost\n';
            const rows = document.querySelectorAll('#costTableBody tr');
            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                const rowData = [
                    cells[0]?.textContent || '',
                    cells[1]?.textContent || '',
                    cells[2]?.textContent || '',
                    cells[3]?.textContent || ''
                ].join(',');
                csv += rowData + '\n';
            });

            downloadFile(csv, 'Cost-Estimate.csv', 'text/csv');
        }

        function downloadFile(content, filename, type) {
            const blob = new Blob([content], { type });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }

        function printProject() {
            window.print();
        }

        function saveProject() {
            const projectJSON = JSON.stringify(projectData, null, 2);
            downloadFile(projectJSON, 'Project-Data.json', 'application/json');
            alert('Project saved successfully!');
        }

        // ===== Initialize =====
        document.getElementById('plotLength').addEventListener('input', calculatePlotArea);
        document.getElementById('plotWidth').addEventListener('input', calculatePlotArea);

        showStep(1);
    </script>
</body>
</html>
