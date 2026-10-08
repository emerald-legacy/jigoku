import { CardType } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import { createToken } from '../../GameActions/GameActions.js';
import SpiritOfTheRiver from '../SpiritOfTheRiver.js';

export default class ForceOfTheRiver extends DrawCard {
    static id = 'force-of-the-river';

    setupCardAbilities() {
        this.attachmentConditions({ myControl: true, trait: 'shugenja' });

        this.action('Create spirits from facedown dynasty cards')
            .condition(() => this.game.isDuringConflict())
            .gameAction(createToken((context) => ({
                target: context.game
                    .getProvinceArray()
                    .flatMap((location) =>
                        context.player.getDynastyCardsInProvince(location).filter((card) => card.isFacedown())
                    ),
                token: SpiritOfTheRiver,
                canEnterConflict: (type) => type === 'military'
            })))
            .chatText('summon {1}!', () => ({
                id: 'spirit-of-the-river',
                label: 'Spirits of the River',
                name: 'Spirits of the River',
                facedown: false,
                type: CardType.Character
            }));
    }
}
