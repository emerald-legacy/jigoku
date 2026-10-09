import { CardType, Duration } from '../../Constants.js';
import { PlayCharacterAsAttachment } from '../../PlayCharacterAsAttachment.js';
import { changeType, modifyBothSkills } from '../../effects.js';
import { cardLastingEffect, detach, multiple } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

export default class PromisingYouth extends DrawCard {
    static id = 'promising-youth';

    setupCardAbilities() {
        this.abilities.playActions.push(new PlayCharacterAsAttachment(this));
        this.whileAttached({
            effect: modifyBothSkills(2)
        });
        this.wouldInterrupt('when attached char leaves play, turn into character')
            .when({
                onCardLeavesPlay: (event, context) => event.card === context.source.parentCharacter
            })
            .gameAction(multiple([
                cardLastingEffect((context) => ({
                    target: context.source,
                    duration: Duration.Custom,
                    effect: changeType(CardType.Character)
                })),
                detach((context) => ({ target: context.source }))
            ]));
    }
}
