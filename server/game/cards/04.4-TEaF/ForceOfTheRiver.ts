import { CardTypes, Locations } from '../../Constants.js';
import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class ForceOfTheRiver extends DrawCard {
    static id = 'force-of-the-river';

    setupCardAbilities() {
        this.attachmentConditions({ myControl: true, trait: 'shugenja' });

        this.action({
            title: 'Create spirits from facedown dynasty cards',
            condition: () => this.game.isDuringConflict(),
            effect: 'summon {1}!',
            effectArgs: {
                id: 'spirit-of-the-river',
                label: 'Spirits of the River',
                name: 'Spirits of the River',
                facedown: false,
                type: CardTypes.Character
            },
            gameAction: AbilityDsl.actions.createToken((context) => ({
                target: context.game
                    .getProvinceArray()
                    .flatMap((location: Locations) =>
                        context.player.getDynastyCardsInProvince(location).filter((card: DrawCard) => card.isFacedown())
                    )
            }))
        });
    }
}
