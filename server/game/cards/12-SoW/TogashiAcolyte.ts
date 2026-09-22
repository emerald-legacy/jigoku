import { CardType } from '../../Constants.js';
import { PlayCharacterAsAttachment } from '../../PlayCharacterAsAttachment.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

export default class TogashiAcolyte extends DrawCard {
    static id = 'togashi-acolyte';

    setupCardAbilities() {
        this.abilities.playActions.push(new PlayCharacterAsAttachment(this));
        this.reaction({
            title: 'Give attached character +1/+1',
            limit: AbilityDsl.limit.unlimitedPerConflict(),
            when: {
                onCardPlayed: (event, context) =>
                    context.source.attachedCharacter &&
                    event.player === context.player &&
                    context.source.type === CardType.Attachment &&
                    context.source.attachedCharacter.isParticipating()
            },
            gameAction: AbilityDsl.actions.cardLastingEffect((context) => ({
                target: context.source.attachedCharacter,
                effect: AbilityDsl.effects.modifyBothSkills(1)
            })),
            effect: 'give +1{1} and +1{2} to {3}',
            effectArgs: (context) => ['political', 'military', context.source.attachedCharacter as DrawCard]
        });
    }

    leavesPlay() {
        this.printedType = CardType.Character;
        super.leavesPlay();
    }
}
