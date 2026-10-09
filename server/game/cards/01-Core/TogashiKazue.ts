import { msg } from '../../GameChat.js';
import { CardType } from '../../Constants.js';
import { PlayCharacterAsAttachment } from '../../PlayCharacterAsAttachment.js';
import { removeFate } from '../../GameActions/GameActions.js';
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
            .target({
                cardType: CardType.Character,
                cardCondition: (card, context) => card.isParticipating() && card !== context.source.parentCharacter
            }, removeFate((context) => ({
                recipient: context.source.parentCharacter ?? undefined
            })))
            .chatText((context) => msg`steal a fate from ${context.chatTarget()} and place it on ${context.source.parentCharacter ?? ''}`)
            .notPrinted();
    }
}
