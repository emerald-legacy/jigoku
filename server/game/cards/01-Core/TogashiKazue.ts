import { CardType } from '../../Constants.js';
import { PlayCharacterAsAttachment } from '../../PlayCharacterAsAttachment.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

export default class TogashiKazue extends DrawCard {
    static id = 'togashi-kazue';

    setupCardAbilities() {
        this.abilities.playActions.push(new PlayCharacterAsAttachment(this));
        this.action('Steal a fate')
            .condition((context) =>
                !!(context.source.type === CardType.Attachment &&
                context.source.parentCharacter &&
                context.source.parentCharacter.isParticipating()))
            .target('target', {
                cardType: CardType.Character,
                cardCondition: (card, context) => card.isParticipating() && card !== context.source.parentCharacter
            }, AbilityDsl.actions.removeFate((context) => ({
                recipient: context.source.parentCharacter ?? undefined
            })))
            .effect('steal a fate from {0} and place it on {1}', (context) => context.source.parentCharacter ?? '')
            .notPrinted();
    }

    leavesPlay() {
        this.printedType = CardType.Character;
        super.leavesPlay();
    }
}
