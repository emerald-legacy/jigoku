describe('Ikoma Yumiko\'s Dagger', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['ancient-master', 'doji-challenger']
                },
                player2: {
                    inPlay: ['ikoma-natsuko', 'ikoma-yumiko-s-dagger']
                }
            });

            this.ancientMaster = this.player1.findCardByName('ancient-master');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.natsuko = this.player2.findCardByName('ikoma-natsuko');
            this.dagger = this.player2.findCardByName('ikoma-yumiko-s-dagger');
        });

        it('removes a fate from both characters when they have fate', function () {
            this.ancientMaster.fate = 2;
            this.dagger.fate = 2;
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.ancientMaster, this.challenger],
                defenders: [this.natsuko, this.dagger]
            });

            this.player2.clickCard(this.dagger);
            this.player2.clickCard(this.ancientMaster);
            expect(this.ancientMaster.location).toBe('play area');
            expect(this.ancientMaster.fate).toBe(1);
            expect(this.dagger.location).toBe('play area');
            expect(this.dagger.fate).toBe(1);
            expect(this.getChatLogs(5)).toContain('player2 uses Ikoma Yumiko\'s Dagger to injure itself and Ancient Master');
        });
    });
});

describe('Ikoma Yumiko\'s Dagger with characters on the other side than their controller', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['ikoma-yumiko-s-dagger'],
                    dynastyDeck: ['moto-youth-2'],
                    hand: ['join-the-fray']
                },
                player2: {
                    inPlay: ['solemn-scholar'],
                    dynastyDeck: ['moto-youth-2'],
                    hand: ['join-the-fray']
                }
            });
            this.dagger = this.player1.findCardByName('ikoma-yumiko-s-dagger');
            this.youth1 = this.player1.placeCardInProvince('moto-youth-2', 'province 1');
            this.youth1.facedown = false;
            this.scholar = this.player2.findCardByName('solemn-scholar');
            this.youth2 = this.player2.placeCardInProvince('moto-youth-2', 'province 1');
            this.youth2.facedown = false;

            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.dagger],
                defenders: [this.scholar]
            });
            this.player2.clickCard(this.player2.findCardByName('join-the-fray'));
            this.player2.clickCard(this.youth2);
            this.player2.clickPrompt('player1');
            this.player1.clickCard(this.player1.findCardByName('join-the-fray'));
            this.player1.clickCard(this.youth1);
            this.player1.clickPrompt('player2');
            this.player2.pass();
        });

        it('chooses a character on the enemy side, whoever controls it', function () {
            expect(this.game.currentConflict.attackers).toContain(this.youth2);
            expect(this.game.currentConflict.defenders).toContain(this.youth1);

            this.player1.clickCard(this.dagger);
            expect(this.player1).toBeAbleToSelect(this.scholar);
            expect(this.player1).toBeAbleToSelect(this.youth1);
            expect(this.player1).not.toBeAbleToSelect(this.youth2);

            this.player1.clickCard(this.youth1);
            expect(this.getChatLogs(5)).toContain('player1 uses Ikoma Yumiko\'s Dagger to injure itself and Moto Youth');
        });
    });
});
