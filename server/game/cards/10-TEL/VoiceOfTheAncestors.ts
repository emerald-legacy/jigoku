import DrawCard from '../../DrawCard.js';
import { AbilityType, CardType, Location, Players, Duration } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class VoiceOfTheAncestors extends DrawCard {
    static id = 'voice-of-the-ancestors';

    setupCardAbilities() {
        const DummySpiritAttachment = new DrawCard(this.owner, {
            cost: '0',
            glory: '0',
            side: 'dynasty',
            text: '',
            type: 'attachment',
            name: 'Spirit Attachment',
            id: 'dummy-spirit-attachment',
            traits: ['spirit']
        });

        this.action({
            title: 'Attach a character as a Spirit',
            target: {
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card, context) =>
                    context.game.actions.attach({ attachment: DummySpiritAttachment }).canAffect(card, context)
            },
            gameAction: AbilityDsl.actions.selectCard({
                cardType: CardType.Character,
                location: Location.DynastyDiscardPile,
                cardCondition: card => card.isFaction('lion'),
                controller: Players.Self,
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.playerLastingEffect(context => ({
                        targetController: context.player,
                        effect: AbilityDsl.effects.reduceNextPlayedCardCost(1)
                    })),
                    AbilityDsl.actions.cardLastingEffect({
                        canChangeZoneOnce: true,
                        duration: Duration.Custom,
                        effect: [
                            AbilityDsl.effects.blank(true),
                            AbilityDsl.effects.changeType(CardType.Attachment),
                            AbilityDsl.effects.addTrait('spirit'),
                            AbilityDsl.effects.attachmentRestrictTraitAmount({ spirit: 1 }),
                            AbilityDsl.effects.gainAbility(AbilityType.Persistent, {
                                match: (card: any, context: any) => card === context.source.parent,
                                effect: [
                                    AbilityDsl.effects.modifyMilitarySkill((card: any, context: any) => context.source.printedMilitarySkill || 0),
                                    AbilityDsl.effects.modifyPoliticalSkill((card: any, context: any) => context.source.printedPoliticalSkill || 0)
                                ]
                            })
                        ]
                    }),
                    AbilityDsl.actions.playCard(context => ({
                        source: this,
                        playCardTarget: attachContext => {
                            attachContext.target = context.target;
                            attachContext.targets.target = context.targets.target;
                        }
                    }))
                ])
            })
        });
    }
}


export default VoiceOfTheAncestors;
