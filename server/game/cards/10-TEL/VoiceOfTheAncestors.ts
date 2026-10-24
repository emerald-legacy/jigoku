import DrawCard from '../../DrawCard.js';
import { AbilityType, CardType, Location, Players, PlayType, Duration, Trait } from '../../Constants.js';
import {
    addTrait,
    attachmentRestrictTraitAmount,
    blank,
    changeType,
    gainAbility,
    modifyMilitarySkill,
    modifyPoliticalSkill,
    reduceNextPlayedCardCost
} from '../../effects.js';
import { attach, cardLastingEffect, playCard, playerLastingEffect, sequential } from '../../GameActions/GameActions.js';

class VoiceOfTheAncestors extends DrawCard {
    static id = 'voice-of-the-ancestors';

    override setupCardAbilities() {
        const DummySpiritAttachment = new DrawCard(this.owner, {
            cost: '0',
            glory: '0',
            side: 'dynasty',
            text: '',
            type: CardType.Attachment,
            name: 'Spirit Attachment',
            id: 'dummy-spirit-attachment',
            traits: ['spirit']
        });

        this.action('Attach a character as a Spirit')
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card, context) =>
                    attach({ attachment: DummySpiritAttachment }).canAffect(card, context)
            })
            .selectCard({
                cardType: CardType.Character,
                location: Location.DynastyDiscardPile,
                // only a character you can pay for with the reduction (RRG Target)
                cardCondition: (card, context) => card.isFaction('lion') &&
                    context.player.getReducedCost(PlayType.Other, card, context.target) - 1 <= context.player.fate,
                controller: Players.Self,
                gameAction: sequential([
                    playerLastingEffect({
                        target: Players.Self,
                        effect: reduceNextPlayedCardCost(1, (card) => card.location === Location.DynastyDiscardPile)
                    }),
                    cardLastingEffect({
                        canChangeZoneOnce: true,
                        duration: Duration.Custom,
                        effect: [
                            blank(true),
                            changeType(CardType.Attachment),
                            addTrait(Trait.Spirit),
                            attachmentRestrictTraitAmount({ spirit: 1 }),
                            gainAbility(AbilityType.Persistent, {
                                match: (card, context) => card === context?.source.parentCharacter,
                                effect: [
                                    modifyMilitarySkill((_card, context) => (context.source.isDrawCard() && context.source.printedMilitarySkill) || 0),
                                    modifyPoliticalSkill((_card, context) => (context.source.isDrawCard() && context.source.printedPoliticalSkill) || 0)
                                ]
                            })
                        ]
                    }),
                    playCard((context) => ({
                        source: this,
                        playCardTarget: (attachContext) => {
                            attachContext.target = context.target;
                            attachContext.targets.target = context.targets.target;
                        }
                    }))
                ])
            });
    }
}


export default VoiceOfTheAncestors;
