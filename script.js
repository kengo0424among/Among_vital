let players = [];
const canvasWidth = 175; // キャンバスの幅
const canvasHeight = 50; // キャンバスの高さ
const intervalTime = 100; // アニメーション更新間隔

const skins = {
    Red: 'Red.png',
    Green: 'Green.png',
    Blue: 'Blue.png',
    Yellow: 'Yellow.png',
    Black: 'Black.png',
    White: 'White.png',
    Cyan: 'Cyan.png',
    Lime: 'Lime.png',
    Brown: 'Brown.png',
    Pink: 'Pink.png',
    Orange: 'Orange.png',
    Purple: 'Purple.png',
    Rose: 'Rose.png',
    Banana: 'Banana.png',
    Coral: 'Coral.png',
    Gray: 'Gray.png',
    Maroon: 'Maroon.png',
};

function updateSkinOptions() {
    const color = document.getElementById('player-color').value;
    const skinImage = skins[color];
    const skinInput = document.getElementById('player-skin');
    if (skinInput) {
        skinInput.value = skinImage;
    } else {
        const newSkinInput = document.createElement('input');
        newSkinInput.type = 'hidden';
        newSkinInput.id = 'player-skin';
        newSkinInput.value = skinImage;
        document.getElementById('player-form').appendChild(newSkinInput);
    }
}

function updatePlayerStatus(event) {
    event.preventDefault(); // フォームのデフォルト送信を防止

    const playerName = document.getElementById('player-name').value;
    const playerStatus = document.getElementById('player-status').value;
    const playerColor = document.getElementById('player-color').value;
    const playerSkin = skins[playerColor];

    console.log("Adding player:", playerName, playerStatus, playerSkin); // デバッグ用ログ

    const player = players.find(p => p.name === playerName);
    if (player) {
        player.status = playerStatus;
        player.skin = playerSkin;
    } else {
        players.push({ name: playerName, status: playerStatus, skin: playerSkin });
    }

    console.log("Current players list:", players); // デバッグ用ログ

    renderECGGrids();
}

function renderECGGrids() {
    const ecgContainer = document.getElementById('ecg-grids');
    ecgContainer.innerHTML = '';

    players.forEach((player, index) => {
        const ecgDiv = document.createElement('div');
        ecgDiv.classList.add('ecg-grid', player.status);

        const playerImage = document.createElement('img');
        playerImage.src = `images/${player.skin}`; // プレイヤースキンフォルダから選択されたスキンを表示
        playerImage.alt = player.name;
        playerImage.classList.add('player-image');

        const statusText = document.createElement('span');
        statusText.classList.add('status');
        if (player.status === 'alive') {
            statusText.textContent = 'O\nK';
            statusText.style.color = 'lightgreen';
        } else if (player.status === 'dead') {
            statusText.textContent = 'D\nE\nD';
            statusText.style.color = 'lightcoral';
        } else if (player.status === 'dc') {
            statusText.textContent = 'D\n/\nC';
            statusText.style.color = 'lightgray';
        }

        const canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.id = `ecg-canvas-${index}`;

        ecgDiv.appendChild(playerImage);
        ecgDiv.appendChild(statusText);
        ecgDiv.appendChild(canvas);
        ecgContainer.appendChild(ecgDiv);

        startECG(player, canvas);
    });
}

function startECG(player, canvas) {
    const ctx = canvas.getContext('2d');
    if (!player.ecgData) player.ecgData = [];
    let position = 0;

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);

        if (player.status === 'alive') {
            player.ecgData[position] = Math.sin(position * 0.1) * 10 + canvas.height / 2;
            ctx.strokeStyle = 'white'; // 生存時の波形色を白に
        } else if (player.status === 'dead') {
            player.ecgData = new Array(canvasWidth).fill(canvas.height / 2); // 死亡時は中央の水平線で埋める
            ctx.strokeStyle = 'darkred'; // 死亡時の波形色を濃い赤に
        } else if (player.status === 'dc') {
            player.ecgData = new Array(canvasWidth).fill(canvas.height / 2); // D/C時は中央の水平線で埋める
            ctx.strokeStyle = 'gray'; // D/C時の波形色を灰色に
        }

        for (let i = 0; i < player.ecgData.length; i++) {
            ctx.lineTo(i, player.ecgData[i]);
            ctx.lineWidth = 2; // 波形の幅を統一
        }

        ctx.stroke();

        position = (position + 1) % canvasWidth;

        setTimeout(() => requestAnimationFrame(draw), intervalTime);
    }

    draw(); // 初回描画の呼び出し
}

document.getElementById('player-form').addEventListener('submit', updatePlayerStatus);
