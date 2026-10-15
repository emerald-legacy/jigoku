import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import type BaseCard from '../../BaseCard.js';
import type Ring from '../../Ring.js';
import { CardType, ConflictType, SkillType } from '../../Constants.js';
import { delayedEffect } from '../../effects.js';
import { discardFromPlay } from '../../GameActions/GameActions.js';

class Castigated extends DrawCard {
    static id = 'castigated';

    setupCardAbilities() {
        this.playOnlyIf((context) => context.game.isDuringConflict(ConflictType.Political) && context.player.cardsInPlay.some((card) => card.type === CardType.Character && card.hasTrait('imperial')));

        this.whileAttached({
            effect: delayedEffect({
                condition: (context) => !!context.source.parentCharacter && !context.source.parentCharacter.hasDash(SkillType.Political) && context.source.parentCharacter.politicalSkill < 1,
                message: (context) => msg`${context.source.parentCharacter} is discarded by ${context.source}`,
                gameAction: discardFromPlay()
            })
        });
    }

    canPlayOn(card: BaseCard | Ring) {
        return card instanceof DrawCard && card.isParticipating() && super.canPlayOn(card);
    }
}


export default Castigated;
