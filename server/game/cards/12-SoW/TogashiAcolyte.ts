import { CardType } from '../../Constants.js';
import { PlayCharacterAsAttachment } from '../../PlayCharacterAsAttachment.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

export default class TogashiAcolyte extends DrawCard {
    static id = 'togashi-acolyte';

    setupCardAbilities() {
        this.abilities.playActions.push(new PlayCharacterAsAttachment(this));
        this.reaction('Give attached character +1/+1')
            .when({
                onCardPlayed: (event, context) =>
                    context.source.parentCharacter &&
                    event.player === context.player &&
                    context.source.type === CardType.Attachment &&
                    context.source.parentCharacter.isParticipating()
            })
            .gameAction(AbilityDsl.actions.cardLastingEffect((context) => ({
                target: context.source.parentCharacter ?? [],
                effect: AbilityDsl.effects.modifyBothSkills(1)
            })))
            .effect('give +1{1} and +1{2} to {3}', (context) => ['political', 'military', context.source.parentCharacter])
            .limit(AbilityDsl.limit.unlimitedPerConflict());
    }

    leavesPlay() {
        this.printedType = CardType.Character;
        super.leavesPlay();
    }
}
