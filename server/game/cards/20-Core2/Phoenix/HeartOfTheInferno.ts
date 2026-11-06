import { CardType, Players, Trait } from '../../../Constants.js';
import { discardFromPlay, onAffinity } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { controlsParticipating } from '../../controlsParticipating.js';

export default class HeartOfTheInferno extends DrawCard {
    static id = 'heart-of-the-inferno';

    override setupCardAbilities() {
        this.conflictAction('Bow a card')
            .ifCondition((context) => controlsParticipating(context.player, Trait.Shugenja))
            .target({
                controller: Players.Any,
                cardType: [CardType.Character, CardType.Attachment],
                // On the enemy side (RRG Side, whoever controls the card): a participating character, or an
                // attachment on one. A card attached to a ring or province has no `parentCharacter`, so it is on no side.
                cardCondition: (card, context) => !!context.player.opponent &&
                    (card.isParticipatingFor(context.player.opponent) ||
                        !!card.parentCharacter?.isParticipatingFor(context.player.opponent)) &&
                    card.attachments.length === 0
            })
            .if((context) => context.target?.type === CardType.Character)
            .bow()
            .otherwise()
            .gameAction(onAffinity({ trait: Trait.Fire, gameAction: discardFromPlay() }));
    }
}
