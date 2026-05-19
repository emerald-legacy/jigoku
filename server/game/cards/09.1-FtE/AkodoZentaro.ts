import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardTypes, Locations, Players } from '../../Constants.js';

class AkodoZentaro extends DrawCard {
    static id = 'akodo-zentaro';

    setupCardAbilities() {
        this.action({
            title: 'Take control of holding',
            condition: context => context.source.isAttacking(),
            target: {
                cardType: CardTypes.Holding,
                controller: Players.Opponent,
                location: Locations.Provinces,
                cardCondition: card => card.isInConflictProvince() && !card.isUnique() && card.isFaceup(),
                gameAction: AbilityDsl.actions.ifAble(context => ({
                    ifAbleAction: AbilityDsl.actions.selectCard({
                        cardType: CardTypes.Province,
                        location: Locations.Provinces,
                        controller: Players.Self,
                        cardCondition: card => card.location !== Locations.StrongholdProvince && !card.isBroken,
                        subActionProperties: card => ({ destination: card.location, target: context.player.getDynastyCardsInProvince(card.location) }),
                        gameAction: AbilityDsl.actions.multiple([
                            AbilityDsl.actions.moveCard({
                                target: context.target,
                                changePlayer: true
                            }),
                            AbilityDsl.actions.discardCard()
                        ])
                    }),
                    otherwiseAction: AbilityDsl.actions.discardCard({ target: context.target })
                }))
            },
            effect: 'take control of {0} and move it one of their provinces'
        });
    }
}


export default AkodoZentaro;
