import { CardType, Duration } from '../../Constants.js';
import { PlayCharacterAsAttachment } from '../../PlayCharacterAsAttachment.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

export default class PromisingYouth extends DrawCard {
    static id = 'promising-youth';

    setupCardAbilities() {
        this.abilities.playActions.push(new PlayCharacterAsAttachment(this));
        this.whileAttached({
            effect: AbilityDsl.effects.modifyBothSkills(2)
        });
        this.wouldInterrupt({
            title: 'when attached char leaves play, turn into character',
            when: {
                onCardLeavesPlay: (event, context) => event.card === context.source.parent
            },
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.cardLastingEffect((context) => ({
                    target: context.source,
                    duration: Duration.Custom,
                    effect: AbilityDsl.effects.changeType(CardType.Character)
                })),
                AbilityDsl.actions.detach((context) => ({ target: context.source }))
            ])
        });
    }

    leavesPlay() {
        this.printedType = CardType.Character;
        super.leavesPlay();
    }
}
