const els = {
    editor: document.getElementById("textEditor"),
    titleInput: document.getElementById("titleInput"),
    creatorInput: document.getElementById("creatorInput"),
    ratioSelect: document.getElementById("ratioSelect"),
    canvasWidth: document.getElementById("canvasWidth"),
    paddingY: document.getElementById("paddingY"),
    paddingX: document.getElementById("paddingX"),
    bgType: document.getElementById("bgType"),
    bgColor1: document.getElementById("bgColor1"),
    gradColor1: document.getElementById("gradColor1"),
    gradColor2: document.getElementById("gradColor2"),
    gradColor3: document.getElementById("gradColor3"),
    gradientDir: document.getElementById("gradientDir"),
    globalTextColor: document.getElementById("globalTextColor"),
    subTextColor: document.getElementById("subTextColor"),
    hlColorA: document.getElementById("hlColorA"),
    hlColorB: document.getElementById("hlColorB"),
    hlColorC: document.getElementById("hlColorC"),
    quoteLineColor: document.getElementById("quoteLineColor"),
    enableQuoteColor: document.getElementById("enableQuoteColor"),
    quoteColor: document.getElementById("quoteColor"),
    enableParenColor: document.getElementById("enableParenColor"),
    parenColor: document.getElementById("parenColor"),
    fontSelect: document.getElementById("fontSelect"),
    alignH: document.getElementById("alignH"),
    wordBreak: document.getElementById("wordBreak"),
    tabs: document.querySelectorAll(".tab-btn"),
    panels: document.querySelectorAll(".tab-panel"),
    fontSize: document.getElementById("fontSize"),
    letterSpacing: document.getElementById("letterSpacing"),
    lineHeight: document.getElementById("lineHeight"),
    paraSpacing: document.getElementById("paraSpacing"),
    fontScaleX: document.getElementById("fontScaleX"),
    captureArea: document.getElementById("captureArea")
};

function updateCanvas() {
    if (!els.captureArea) return;

    const ratio = els.ratioSelect.value;
    els.captureArea.style.width = "";
    els.captureArea.style.height = "";
    els.captureArea.style.aspectRatio = "";

    if (ratio === "free") {
        const customW = els.canvasWidth.value || 520;
        els.captureArea.style.width = `${customW}px`;
        els.captureArea.style.height = "auto";
        els.captureArea.style.maxHeight = "none";
        els.captureArea.style.margin = "auto";
    } else {
        const [wStr, hStr] = ratio.split(":");
        const w = parseInt(wStr),
            h = parseInt(hStr);
        const targetWidth = Math.min(600, els.captureArea.parentElement.clientWidth || 600, 420);
        const targetHeight = Math.round((targetWidth * h) / w);
        els.captureArea.style.aspectRatio = "";
        els.captureArea.style.width = `${targetWidth}px`;
        els.captureArea.style.height = `${targetHeight}px`;
        els.captureArea.style.maxHeight = "none";
        els.captureArea.style.margin = "0 auto";
    }

    els.captureArea.style.padding = `${els.paddingY.value}px ${els.paddingX.value}px`;

    if (els.bgType.value === "solid") {
        document.getElementById("solidColorArea").style.display = "grid";
        document.getElementById("gradientColorArea").style.display = "none";
        els.captureArea.style.background = els.bgColor1.value;
    } else {
        document.getElementById("solidColorArea").style.display = "none";
        document.getElementById("gradientColorArea").style.display = "flex";

        const gradModeActive = document.querySelector('input[name="gradMode"]:checked')?.value;
        const grad3Wrapper = document.getElementById("grad3Wrapper");

        if (gradModeActive === "3") {
            if (grad3Wrapper) grad3Wrapper.style.display = "flex";
            els.captureArea.style.background = `linear-gradient(${els.gradientDir.value}, ${els.gradColor1.value}, ${els.gradColor2.value}, ${els.gradColor3.value})`;
        } else {
            if (grad3Wrapper) grad3Wrapper.style.display = "none";
            els.captureArea.style.background = `linear-gradient(${els.gradientDir.value}, ${els.gradColor1.value}, ${els.gradColor2.value})`;
        }
    }

    const textWrapper = document.getElementById("canvasTextWrapper");
    if (textWrapper) {
        let rawHTML = els.editor.innerHTML || "<div><br></div>";
        textWrapper.innerHTML = rawHTML;

        normalizeParagraphs(textWrapper);

        textWrapper.style.setProperty("--quote-line-color", els.quoteLineColor.value);
        if (els.editor) {
            els.editor.style.setProperty("--quote-line-color", els.quoteLineColor.value);
        }

        applySmartHighlighting(textWrapper);

        const canvasSpans = textWrapper.getElementsByTagName("span");
        for (let span of canvasSpans) {
            if (span.style.backgroundColor && span.style.backgroundColor !== "transparent") {
                span.style.display = "inline";
                span.style.boxDecorationBreak = "clone";
                span.style.webkitBoxDecorationBreak = "clone";
            }
        }

        textWrapper.style.fontFamily = els.fontSelect.value;
        textWrapper.style.fontSize = `${els.fontSize.value}px`;
        textWrapper.style.textAlign = els.alignH.value;
        textWrapper.style.letterSpacing = `${els.letterSpacing.value}px`;
        textWrapper.style.lineHeight = `${els.lineHeight.value}px`;
        textWrapper.style.whiteSpace = "pre-wrap";
        textWrapper.style.wordBreak = els.wordBreak.value;
        textWrapper.style.color = els.globalTextColor.value;

        const scaleFactor = (parseInt(els.fontScaleX.value) || 100) / 100;
        textWrapper.style.display = "block";
        textWrapper.style.width = `${100 / scaleFactor}%`;
        textWrapper.style.transform = `scaleX(${scaleFactor})`;

        if (els.alignH.value === "center") {
            textWrapper.style.transformOrigin = "center top";
            textWrapper.style.marginLeft = `calc((100% - 100% / ${scaleFactor}) / 2)`;
        } else if (els.alignH.value === "right") {
            textWrapper.style.transformOrigin = "right top";
            textWrapper.style.marginLeft = `calc(100% - 100% / ${scaleFactor})`;
        } else {
            textWrapper.style.transformOrigin = "left top";
            textWrapper.style.marginLeft = "0";
        }
    }

    const allParagraphs = textWrapper.querySelectorAll(
        "#canvasTextWrapper > div, #canvasTextWrapper > p, #canvasTextWrapper > .dialogue-line"
    );
    allParagraphs.forEach((p, idx) => {
        if (idx === allParagraphs.length - 1) {
            p.style.marginBottom = "0px";
            p.style.paddingBottom = "0px";
        } else {
            p.style.marginBottom = `${els.paraSpacing.value}px`;
        }
    });

    const infoContainer = document.getElementById("canvasInfo");
    const textContainer = document.getElementById("canvasTextContainer");

    if (infoContainer && textContainer) {
        if (infoContainer.parentNode !== textContainer) {
            textContainer.appendChild(infoContainer);
        }

        if (els.alignH.value === "center") {
            infoContainer.style.justifyContent = "center";
        } else if (els.alignH.value === "right") {
            infoContainer.style.justifyContent = "flex-end";
        } else {
            infoContainer.style.justifyContent = "flex-start";
        }

        const baseColor = els.globalTextColor.value;
        const fontName = els.fontSelect.value;
        const computedFontSize = Math.max(12, parseFloat(els.fontSize.value) * 0.65);

        const titleVal = els.titleInput.value.trim();
        const creatorVal = els.creatorInput.value.trim();

        let infoHTML = "";

        if (titleVal || creatorVal) {
            infoHTML += `<span class="info-dash" style="color: ${baseColor}; font-size: ${computedFontSize}px; margin-right: 6px;">｜</span>`;

            if (titleVal && creatorVal) {
                infoHTML +=
                    `<span class="info-text-node" style="color: ${baseColor}; font-family: ${fontName}; font-size: ${computedFontSize}px;">${titleVal}</span>` +
                    `<span class="info-divider" style="color: ${baseColor}; font-size: ${computedFontSize}px; margin: 0 6px;">•</span>` +
                    `<span class="info-text-node" style="color: ${baseColor}; opacity: 0.7; font-family: ${fontName}; font-size: ${computedFontSize}px;">${creatorVal}</span>`;
            } else if (titleVal) {
                infoHTML += `<span class="info-text-node" style="color: ${baseColor}; font-family: ${fontName}; font-size: ${computedFontSize}px;">${titleVal}</span>`;
            } else if (creatorVal) {
                infoHTML += `<span class="info-text-node" style="color: ${baseColor}; opacity: 0.7; font-family: ${fontName}; font-size: ${computedFontSize}px;">${creatorVal}</span>`;
            }
        }

        infoContainer.innerHTML = infoHTML;

        if (!titleVal && !creatorVal) {
            infoContainer.style.display = "none";
        } else {
            infoContainer.style.display = "flex";
        }
    }

    if (typeof syncLiveHighlights === "function") {
        try {
            syncLiveHighlights();
        } catch (e) {
            console.warn("하이라이트 싱크 중 경고 발생:", e);
        }
    }
}

function applySmartHighlighting(container) {
    const hasQuotes = els.enableQuoteColor.checked;
    const hasParens = els.enableParenColor.checked;
    if (!hasQuotes && !hasParens) return;

    const textNodes = [];
    const walk = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null, false);
    let n;
    while ((n = walk.nextNode())) {
        textNodes.push(n);
    }

    let fullText = "";
    const nodeOffsets = [];
    textNodes.forEach((node) => {
        nodeOffsets.push({
            node: node,
            start: fullText.length,
            end: fullText.length + node.nodeValue.length
        });
        fullText += node.nodeValue;
    });

    const intervals = [];
    if (hasQuotes) {
        const quoteRegex = /("[^"\n]*"|“[^”\n]*”|「[^」\n]*」|『[^』\n]*』|‹[^›\n]*›|«[^»\n]*»)/g;
        let match;
        while ((match = quoteRegex.exec(fullText)) !== null) {
            intervals.push({ start: match.index, end: match.index + match[0].length, color: els.quoteColor.value });
        }
    }
    if (hasParens) {
        const parenRegex = /(\([^)\n]*\)|\[[^\]\n]*\]|\{[^}\n]*\}|〈[^〉\n]*〉|《[^》\n]*\s*》)/g;
        let match;
        while ((match = parenRegex.exec(fullText)) !== null) {
            intervals.push({ start: match.index, end: match.index + match[0].length, color: els.parenColor.value });
        }
    }

    intervals.sort((a, b) => b.start - a.start);

    intervals.forEach((item) => {
        for (let i = nodeOffsets.length - 1; i >= 0; i--) {
            const info = nodeOffsets[i];
            const overlapStart = Math.max(item.start, info.start);
            const overlapEnd = Math.min(item.end, info.end);

            if (overlapStart < overlapEnd) {
                const localStart = overlapStart - info.start;
                const localEnd = overlapEnd - info.start;
                const node = info.node;
                const text = node.nodeValue;

                const p3 = text.substring(localEnd);
                const p2 = text.substring(localStart, localEnd);
                const p1 = text.substring(0, localStart);

                const parent = node.parentNode;
                const span = document.createElement("span");
                span.style.color = item.color;
                span.style.fontWeight = "inherit";
                span.style.fontFamily = "inherit";
                span.style.backgroundColor = "transparent";
                span.textContent = p2;

                let nextSibling = node.nextSibling;
                if (p3.length > 0) {
                    const t3 = document.createTextNode(p3);
                    parent.insertBefore(t3, nextSibling);
                    nextSibling = t3;
                }
                parent.insertBefore(span, nextSibling);

                if (p1.length > 0) {
                    node.nodeValue = p1;
                } else {
                    parent.removeChild(node);
                }
            }
        }
    });
}

let lastHlColors = { A: "#fef08a", B: "#bbf7d0", C: "#bfdbfe" };
let lastSubTextColor = "#64748b";

function hexToRgb(hex) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const fullHex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
    return result ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})` : "";
}

function syncLiveHighlights(overrideColors = null) {
    const textWrapper = document.getElementById("canvasTextWrapper");
    if (!textWrapper) return;

    let baseA = lastHlColors.A;
    let baseB = lastHlColors.B;
    let baseC = lastHlColors.C;
    let baseSub = lastSubTextColor;

    if (overrideColors) {
        if (overrideColors.hlColorA && els.hlColorA) els.hlColorA.value = overrideColors.hlColorA;
        if (overrideColors.hlColorB && els.hlColorB) els.hlColorB.value = overrideColors.hlColorB;
        if (overrideColors.hlColorC && els.hlColorC) els.hlColorC.value = overrideColors.hlColorC;
        if (overrideColors.subTextColor && els.subTextColor) els.subTextColor.value = overrideColors.subTextColor;
    }

    const oldRgbA = hexToRgb(baseA).replace(/\s+/g, "");
    const oldRgbB = hexToRgb(baseB).replace(/\s+/g, "");
    const oldRgbC = hexToRgb(baseC).replace(/\s+/g, "");
    const oldRgbSub = hexToRgb(baseSub).replace(/\s+/g, "");

    const targetColorA = els.hlColorA ? els.hlColorA.value : baseA;
    const targetColorB = els.hlColorB ? els.hlColorB.value : baseB;
    const targetColorC = els.hlColorC ? els.hlColorC.value : baseC;
    const targetColorSub = els.subTextColor ? els.subTextColor.value : baseSub;

    const updateSpansColor = (container) => {
        if (!container) return;

        const spans = container.getElementsByTagName("span");
        for (let span of spans) {
            const bg = span.style.backgroundColor;
            if (bg && bg !== "transparent" && bg !== "initial") {
                const normalizedBg = bg.replace(/\s+/g, "");
                if (normalizedBg === oldRgbA) span.style.backgroundColor = targetColorA;
                else if (normalizedBg === oldRgbB) span.style.backgroundColor = targetColorB;
                else if (normalizedBg === oldRgbC) span.style.backgroundColor = targetColorC;

                span.style.display = "inline";
                span.style.boxDecorationBreak = "clone";
                span.style.webkitBoxDecorationBreak = "clone";
            }

            const fg = span.style.color;
            if (fg && fg !== "transparent" && fg !== "initial") {
                const normalizedFg = fg.replace(/\s+/g, "");
                if (normalizedFg === oldRgbSub) {
                    span.style.color = targetColorSub;
                }
            }
        }

        const fonts = container.getElementsByTagName("font");
        for (let font of fonts) {
            const fontColor = font.color || font.style.color;
            if (fontColor) {
                const currentFontRgb = (fontColor.startsWith("#") ? hexToRgb(fontColor) : fontColor).replace(
                    /\s+/g,
                    ""
                );
                if (currentFontRgb === oldRgbSub) {
                    font.color = targetColorSub;
                    font.style.color = targetColorSub;
                }
            }
        }
    };

    updateSpansColor(els.editor);
    updateSpansColor(textWrapper);

    if (els.hlColorA) lastHlColors.A = els.hlColorA.value;
    if (els.hlColorB) lastHlColors.B = els.hlColorB.value;
    if (els.hlColorC) lastHlColors.C = els.hlColorC.value;
    if (els.subTextColor) lastSubTextColor = els.subTextColor.value;
}

function prepareCanvasForCapture(container) {
    const targetSpans = container.querySelectorAll("span");
    targetSpans.forEach((span) => {
        const bg = span.style.backgroundColor;
        if (bg && bg !== "transparent" && bg !== "initial") {
            span.setAttribute("data-original-html", span.innerHTML);

            const chars = Array.from(span.textContent);
            const wrappedHTML = chars
                .map((char) => {
                    if (char === "\n") return "\n";
                    return `<span style="background-color: ${bg}; display: inline; color: inherit; font-family: inherit; font-weight: inherit;">${char}</span>`;
                })
                .join("");

            span.innerHTML = wrappedHTML;
            span.style.backgroundColor = "transparent";
        }
    });
}

function restoreCanvasAfterCapture(container) {
    const targetSpans = container.querySelectorAll("span[data-original-html]");
    targetSpans.forEach((span) => {
        const originalHTML = span.getAttribute("data-original-html");
        const restoredBg = span.querySelector("span")?.style.backgroundColor || "transparent";

        span.innerHTML = originalHTML;
        span.style.backgroundColor = restoredBg;
        span.removeAttribute("data-original-html");
    });
}

document.getElementById("btnBold").addEventListener("click", () => {
    document.execCommand("bold", false, null);
    updateCanvas();
});
document.getElementById("btnItalic").addEventListener("click", () => {
    document.execCommand("italic", false, null);
    updateCanvas();
});

document.getElementById("btnQuoteWrap").addEventListener("click", () => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    document.execCommand("insertText", false, `“${selectedText}”`);
    updateCanvas();
});

document.getElementById("btnSubText").addEventListener("click", () => {
    const color = els.subTextColor ? els.subTextColor.value : "#64748b";
    document.execCommand("foreColor", false, color);
    if (typeof syncLiveHighlights === "function") {
        syncLiveHighlights();
    }
    updateCanvas();
});

document.getElementById("selHighlight").addEventListener("change", function () {
    const val = this.value;
    if (!val) return;

    let color = "#fef08a";
    if (val === "A") color = els.hlColorA.value;
    if (val === "B") color = els.hlColorB.value;
    if (val === "C") color = els.hlColorC.value;

    document.execCommand("backColor", false, color);
    this.value = "";

    const spans = els.editor.getElementsByTagName("span");
    for (let span of spans) {
        if (span.style.backgroundColor && span.style.backgroundColor !== "transparent") {
            span.style.display = "inline";
            span.style.boxDecorationBreak = "clone";
            span.style.webkitBoxDecorationBreak = "clone";
        }
    }
    updateCanvas();
});

document.getElementById("btnQuoteLine").addEventListener("click", () => {
    let selection = window.getSelection();
    if (!selection.rangeCount) return;
    let range = selection.getRangeAt(0);
    let block = range.commonAncestorContainer;
    while (block && block.nodeType !== Node.ELEMENT_NODE) {
        block = block.parentNode;
    }
    if (block && block.id !== "textEditor") {
        if (block.classList.contains("dialogue-line")) {
            block.classList.remove("dialogue-line");
        } else {
            block.classList.add("dialogue-line");
        }
    } else {
        let div = document.createElement("div");
        div.classList.add("dialogue-line");
        div.appendChild(range.extractContents());
        range.insertNode(div);
    }
    updateCanvas();
});

els.editor.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const node = selection.anchorNode;
        const inDialogue = (node.nodeType === 3 ? node.parentNode : node).closest(".dialogue-line");

        if (inDialogue) {
            e.preventDefault();
            document.execCommand("insertLineBreak");
        }
    }
});

document.addEventListener("DOMContentLoaded", () => {
    els.tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            const targetId = tab.getAttribute("data-target");
            const targetPanel = document.getElementById(targetId);
            const subWindow = document.querySelector(".adaptive-settings-window");

            if (tab.classList.contains("active")) {
                tab.classList.remove("active");
                if (targetPanel) targetPanel.classList.remove("active");
                if (subWindow) subWindow.classList.remove("active");
            } else {
                els.tabs.forEach((t) => t.classList.remove("active"));
                els.panels.forEach((p) => p.classList.remove("active"));

                tab.classList.add("active");
                if (targetPanel) targetPanel.classList.add("active");
                if (subWindow) subWindow.classList.add("active");
            }
        });
    });

    document.querySelectorAll(".segmented-control button").forEach((btn) => {
        btn.addEventListener("click", () => {
            const parent = btn.parentElement;
            parent.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");

            const hiddenInput = document.getElementById(parent.getAttribute("data-target"));
            if (hiddenInput) {
                hiddenInput.value = btn.getAttribute("data-value");
                updateCanvas();
            }
        });
    });

    document.querySelectorAll('input[name="gradMode"]').forEach((radio) => {
        radio.addEventListener("change", () => {
            updateCanvas();
        });
    });

    els.ratioSelect.addEventListener("change", () => {
        const customArea = document.getElementById("customWidthArea");
        if (customArea) {
            customArea.style.display = els.ratioSelect.value === "free" ? "flex" : "none";
        }
        updateCanvas();
    });

    els.editor.addEventListener("input", updateCanvas);

    if (typeof renderPresets === "function") {
        renderPresets();
    }

    const autoTriggers = [
        els.titleInput,
        els.creatorInput,
        els.canvasWidth,
        els.paddingY,
        els.paddingX,
        els.bgType,
        els.bgColor1,
        els.gradColor1,
        els.gradColor2,
        els.gradColor3,
        els.gradientDir,
        els.globalTextColor,
        els.subTextColor,
        els.hlColorA,
        els.hlColorB,
        els.hlColorC,
        els.quoteLineColor,
        els.enableQuoteColor,
        els.quoteColor,
        els.enableParenColor,
        els.parenColor,
        els.fontSelect,
        els.wordBreak,
        els.fontSize,
        els.letterSpacing,
        els.lineHeight,
        els.paraSpacing,
        els.fontScaleX
    ];

    autoTriggers.forEach((element) => {
        if (element) {
            element.addEventListener("input", updateCanvas);
            element.addEventListener("change", updateCanvas);
        }
    });

    setTimeout(() => {
        updateCanvas();
    }, 50);
});

document.getElementById("btnCopy").addEventListener("click", () => {
    if (!els.captureArea) return;
    const originalHeight = els.captureArea.style.height;
    if (els.ratioSelect.value === "free") {
        els.captureArea.style.height = els.captureArea.scrollHeight + "px";
    }

    prepareCanvasForCapture(els.captureArea);

    html2canvas(els.captureArea, { useCORS: true, allowTaint: true, backgroundColor: null, scale: 2 })
        .then((canvas) => {
            restoreCanvasAfterCapture(els.captureArea);
            els.captureArea.style.height = originalHeight;

            canvas.toBlob((blob) => {
                if (!blob) {
                    alert("이미지 변환 실패");
                    return;
                }
                const item = new ClipboardItem({ "image/png": blob });
                navigator.clipboard
                    .write([item])
                    .then(() => {
                        alert("발췌문 이미지가 클립보드에 복사되었습니다!");
                    })
                    .catch(() => {
                        alert("보안 정책으로 이미지 복사가 실패했습니다. 저장 버튼을 이용해 주세요.");
                    });
            }, "image/png");
        })
        .catch(() => {
            restoreCanvasAfterCapture(els.captureArea);
            els.captureArea.style.height = originalHeight;
        });
});

document.getElementById("btnSave").addEventListener("click", () => {
    if (!els.captureArea) return;
    const originalWidth = els.captureArea.style.width;
    const originalHeight = els.captureArea.style.height;
    if (els.ratioSelect.value === "free") {
        els.captureArea.style.height = els.captureArea.scrollHeight + "px";
    }

    prepareCanvasForCapture(els.captureArea);

    html2canvas(els.captureArea, { useCORS: true, allowTaint: true, backgroundColor: null, scale: 2 })
        .then((canvas) => {
            restoreCanvasAfterCapture(els.captureArea);
            els.captureArea.style.width = originalWidth;
            els.captureArea.style.height = originalHeight;

            const link = document.createElement("a");
            link.download = `excerpt_${Date.now()}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
        })
        .catch(() => {
            restoreCanvasAfterCapture(els.captureArea);
            els.captureArea.style.width = originalWidth;
            els.captureArea.style.height = originalHeight;
        });
});

document.getElementById("bgImageInput").addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            document.getElementById("bgImageLayer").style.backgroundImage = `url(${event.target.result})`;
            updateBgImageStyles();
        };
        reader.readAsDataURL(file);
    }
});

function updateBgImageStyles() {
    const bgLayer = document.getElementById("bgImageLayer");
    const overlayLayer = document.getElementById("bgOverlayLayer");

    bgLayer.style.backgroundSize = `${document.getElementById("bgImageSize").value}%`;
    bgLayer.style.backgroundPosition = `${document.getElementById("bgImageX").value}% ${document.getElementById("bgImageY").value}%`;
    bgLayer.style.filter = `blur(${document.getElementById("bgImageBlur").value}px)`;

    const color = document.getElementById("bgOverlayColor").value;
    const opacity = document.getElementById("bgOverlayOpacity").value;
    overlayLayer.style.backgroundColor = `rgba(${color}, ${opacity})`;
}

["bgImageSize", "bgImageX", "bgImageY", "bgImageBlur", "bgOverlayColor", "bgOverlayOpacity"].forEach((id) => {
    document.getElementById(id).addEventListener("input", updateBgImageStyles);
});

document.getElementById("textEditor").addEventListener("paste", function (e) {
    e.preventDefault();
    const text = (e.originalEvent || e).clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
});

function normalizeParagraphs(container) {
    const paragraphs = [];
    let currentParagraphNodes = [];

    function flushParagraph() {
        if (currentParagraphNodes.length > 0) {
            paragraphs.push(currentParagraphNodes);
            currentParagraphNodes = [];
        }
    }

    function parseNodes(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            currentParagraphNodes.push(node.cloneNode(true));
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            const tagName = node.tagName;

            if (tagName === "BR") {
                if (currentParagraphNodes.length > 0) {
                    flushParagraph();
                } else {
                    paragraphs.push([]);
                }
            } else if (node.classList.contains("dialogue-line")) {
                flushParagraph();
                paragraphs.push(node.cloneNode(true));
                flushParagraph();
            } else if (tagName === "DIV" || tagName === "P" || /^H[1-6]$/.test(tagName)) {
                flushParagraph();
                Array.from(node.childNodes).forEach(parseNodes);
                flushParagraph();
            } else {
                if (node.querySelector("div, p, br, .dialogue-line")) {
                    Array.from(node.childNodes).forEach(parseNodes);
                } else {
                    currentParagraphNodes.push(node.cloneNode(true));
                }
            }
        }
    }

    Array.from(container.childNodes).forEach(parseNodes);
    flushParagraph();

    while (paragraphs.length > 0) {
        const lastPara = paragraphs[paragraphs.length - 1];
        if (!(lastPara instanceof HTMLElement)) {
            const isTextEmpty = lastPara.every((node) => node.textContent.trim() === "");
            if (isTextEmpty) {
                paragraphs.pop();
                continue;
            }
        }
        break;
    }

    container.innerHTML = "";
    paragraphs.forEach((pNodes) => {
        if (pNodes instanceof HTMLElement && pNodes.classList.contains("dialogue-line")) {
            container.appendChild(pNodes);
        } else {
            const newDiv = document.createElement("div");
            if (pNodes.length === 0) {
                newDiv.appendChild(document.createElement("br"));
            } else {
                pNodes.forEach((n) => newDiv.appendChild(n));
            }
            container.appendChild(newDiv);
        }
    });

    if (container.childNodes.length === 0) {
        container.innerHTML = "<div><br></div>";
    }
}
