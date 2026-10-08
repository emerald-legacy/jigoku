import { Location, Phases } from '../Constants.js';
import { randomItem } from '../utils/random.js';
import type Game from '../Game.js';
import { Phase } from './Phase.js';
import { SimpleStep } from './SimpleStep.js';
import { MulliganConflictPrompt } from './setup/MulliganConflictPrompt.js';
import { MulliganDynastyPrompt } from './setup/MulliganDynastyPrompt.js';
import { SetupProvincesPrompt } from './setup/SetupProvincesPrompt.js';

export class SetupPhase extends Phase {
    constructor(game: Game) {
        super(game, Phases.Setup);
        this.game.currentPhase = Phases.Setup;
        this.pipeline.initialise([
            new SimpleStep(game, () => this.setupBegin()),
            new SimpleStep(game, () => this.chooseFirstPlayer()),
            new SimpleStep(game, () => this.attachStronghold()),
            new SimpleStep(game, () => this.setupProvinces()),
            new SimpleStep(game, () => this.fillProvinces()),
            new MulliganDynastyPrompt(game),
            new SimpleStep(game, () => this.drawStartingHands()),
            new MulliganConflictPrompt(game),
            new SimpleStep(game, () => this.startGame())
        ]);
    }

    setupBegin() {
        const coinTossWinner = randomItem(this.game.getPlayers());
        if(coinTossWinner) {
            coinTossWinner.firstPlayer = true;
        }
    }

    chooseFirstPlayer() {
        const firstPlayer = this.game.getFirstPlayer();
        if(!firstPlayer || !firstPlayer.opponent) {
            return;
        }
        const opponent = firstPlayer.opponent;

        if(
            firstPlayer.stronghold?.stealFirstPlayerDuringSetupWithMsg &&
            !opponent.stronghold?.stealFirstPlayerDuringSetupWithMsg
        ) {
            return;
        }

        if(
            !firstPlayer.stronghold?.stealFirstPlayerDuringSetupWithMsg &&
            opponent.stronghold?.stealFirstPlayerDuringSetupWithMsg
        ) {
            firstPlayer.firstPlayer = false;
            opponent.firstPlayer = true;
            this.game.addMessage(opponent.stronghold.stealFirstPlayerDuringSetupWithMsg, [
                opponent
            ]);
            return;
        }

        this.game.promptWithHandlerMenu(firstPlayer, {
            activePromptTitle: 'You won the flip. Do you want to be:',
            source: 'Choose First Player',
            options: [
                {
                    text: 'First Player',
                    handler: () => {
                        this.game.setFirstPlayer(firstPlayer);
                    }
                },
                {
                    text: 'Second Player',
                    handler: () => {
                        this.game.setFirstPlayer(opponent);
                    }
                }
            ]
        });
    }

    attachStronghold() {
        if(!this.game.rules.setupHaveStrongholds) {
            return;
        }
        for(const player of this.game.getPlayers()) {
            if(player.stronghold) {
                player.moveCard(player.stronghold, Location.StrongholdProvince);
            }
            if(player.role) {
                player.role.moveTo(Location.Role);
            }
        }
    }

    setupProvinces() {
        if(!this.game.rules.setupHaveProvinceCards) {
            for(const player of this.game.getPlayers()) {
                for(const location of this.game.rules.setupNonStrongholdProvinces) {
                    player.moveCard(player.provinceDeck[0], location);
                }
                player.hideProvinceDeck = true;
            }
        } else {
            this.queueStep(new SetupProvincesPrompt(this.game));
        }
    }

    fillProvinces() {
        const provinces = this.game.rules.setupNonStrongholdProvinces;
        for(const player of this.game.getPlayers()) {
            for(const province of provinces) {
                const card = player.dynastyDeck[0];
                if(card) {
                    player.moveCard(card, province);
                    card.facedown = false;
                }
            }
        }

        for(const card of this.game.allCards) {
            card.applyAnyLocationPersistentEffects();
        }
    }

    drawStartingHands() {
        for(const player of this.game.getPlayers()) {
            player.drawCardsToHand(this.game.rules.setupStartingHandSize);
        }
    }

    startGame() {
        for(const player of this.game.getPlayers()) {
            const strongholdHonor = player.stronghold?.cardData.honor ?? 0;
            player.honor = this.game.rules.setupFixedStartingHonor ?? strongholdHonor;
            player.readyToStart = true;
        }
        this.endPhase();
    }
}
