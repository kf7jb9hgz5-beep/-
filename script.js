function fitTextToCanvas() {
    const area = els.captureArea;
    const w = parseFloat(area.dataset.fixedRatioW);
    const h = parseFloat(area.dataset.fixedRatioH);
    if (!w || !h) return;

    const textWrapper = document.getElementById("canvasTextWrapper");
    if (!textWrapper) return;

    const baseFontSize = parseFloat(els.fontSize.value) || 16;
    const baseLineHeight = parseFloat(els.lineHeight.value) || 28;
    const lhRatio = baseLineHeight / baseFontSize;

    const areaW = area.getBoundingClientRect().width || parseFloat(area.style.width) || 420;
    const targetH = (areaW * h) / w;

    // 1단계: 원래 폰트 크기로 자연 높이 측정
    textWrapper.style.fontSize = `${baseFontSize}px`;
    textWrapper.style.lineHeight = `${baseLineHeight}px`;
    area.style.height = "auto";
    area.style.overflow = "visible";

    // iOS에서 레이아웃이 반영되도록 강제 리플로우
    void area.offsetHeight;

    const naturalH = area.scrollHeight;

    if (naturalH <= targetH + 2) {
        area.style.height = `${Math.round(targetH)}px`;
        area.style.overflow = "hidden";
        return;
    }

    // 2단계: 비율로 한 번에 폰트 크기 계산
    const scale = targetH / naturalH;
    const newFontSize = Math.max(4, baseFontSize * scale * 0.97);
    const newLineHeight = newFontSize * lhRatio;

    textWrapper.style.fontSize = `${newFontSize}px`;
    textWrapper.style.lineHeight = `${newLineHeight}px`;

    // 3단계: 적용 후 다시 확인
    void area.offsetHeight;
    const checkH = area.scrollHeight;

    if (checkH > targetH + 2) {
        const scale2 = targetH / checkH;
        const finalSize = Math.max(4, newFontSize * scale2 * 0.97);
        textWrapper.style.fontSize = `${finalSize}px`;
        textWrapper.style.lineHeight = `${finalSize * lhRatio}px`;
    }

    area.style.height = `${Math.round(targetH)}px`;
    area.style.overflow = "hidden";
}
