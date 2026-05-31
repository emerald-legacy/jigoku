import { UiPrompt } from '../UiPrompt.js';
import { CardTypes, EffectNames, EventNames } from '../../Constants.js';
import type Player from '../../Player.js';
import type Game from '../../Game.js';
import type DrawCard from '../../DrawCard.js';

const capitalize: Record<string, string> = {
    military: 'Military',
    political: 'Political',
    air: 'Air',
    water: 'Water',
    earth: 'Earth',
    fire: 'Fire',
    void: 'Void'
};

class SelectDefendersPrompt extends UiPrompt {
    player: Player;
    conflict: any;

    constructor(game: Game, player: Player, conflict: any) {
        super(game);

        this.player = player;
        this.conflict = conflict;
        let mustBeDeclared = this.player.cardsInPlay.filter((card: DrawCard) =>
            card.getEffects(EffectNames.MustBeDeclaredAsDefender).some((effect) => effect === 'both' || effect === conflict.conflictType));
        for(const card of mustBeDeclared) {
            if(this.checkCardCondition(card) && !this.conflict.defenders.includes(card)) {
                this.selectCard(card);
            }
        }
    }

    activeCondition(player: Player): boolean {
        return player === this.player;
    }

    activePrompt() {
        let promptTitle = (capitalize[this.conflict.conflictType] + ' ' + capitalize[this.conflict.element] + ' Conflict: '
            + this.conflict.attackerSkill + ' vs ' + this.conflict.defenderSkill);

        if(!this.conflict.conflictType || !this.conflict.element) {
            promptTitle = 'Declaring defenders before attackers';
        }
        return {
            menuTitle: 'Choose defenders',
            buttons: [{ text: 'Done', arg: 'done' }],
            promptTitle: promptTitle
        };
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent to choose defenders' };
    }

    onCardClicked(player: Player, card: DrawCard): boolean {
        if(player !== this.player) {
            return false;
        }

        if(!this.checkCardCondition(card)) {
            return false;
        }

        return this.selectCard(card);
    }

    checkCardCondition(card: DrawCard): boolean {
        if(this.conflict.defenders.includes(card) && card.getEffects(EffectNames.MustBeDeclaredAsDefender).some((effect) => effect === 'both' || effect === this.conflict.conflictType)) {
            return false;
        }
        return (
            card.getType() === CardTypes.Character &&
            card.controller === this.player &&
            card.canDeclareAsDefender(this.conflict.conflictType)
        );
    }

    selectCard(card: DrawCard): boolean {
        if(this.conflict.maxAllowedDefenders > -1 && this.conflict.defenders.length >= this.conflict.maxAllowedDefenders && !this.conflict.defenders.includes(card)) {
            return false;
        }

        if(!this.conflict.defenders.includes(card)) {
            this.conflict.addDefender(card);
        } else {
            this.conflict.removeFromConflict(card);
        }

        this.conflict.calculateSkill(true);

        return true;
    }

    menuCommand(): boolean {
        this.conflict.defenders.forEach((card: DrawCard) => card.covert = false);
        this.conflict.setDefendersChosen(true);
        this.complete();
        this.game.raiseEvent(EventNames.OnDefendersDeclared, { conflict: this.conflict, defenders: this.conflict.defenders.slice() });
        return true;
    }
}

export default SelectDefendersPrompt;
