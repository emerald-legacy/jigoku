describe('Seppun Ishikawa', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['seppun-ishikawa', 'miya-mystic'],
                    dynastyDiscard: ['imperial-storehouse', 'otomo-courtier'],
                    provinces: ['before-the-throne']
                },
                player2: {
                    inPlay: ['seppun-guardsman', 'akodo-toturi'],
                    dynastyDiscard: ['imperial-storehouse']
                }
            });

            this.ishikawa = this.player1.findCardByName('seppun-ishikawa');
            this.mystic = this.player1.findCardByName('miya-mystic');
            this.throne = this.player1.findCardByName('before-the-throne', 'province 1');
            this.toturi = this.player2.findCardByName('akodo-toturi');
        });

        it('should count each other Imperial card you control in play, but not the opponent\'s', function() {
            expect(this.ishikawa.getMilitarySkill()).toBe(3);
            expect(this.ishikawa.getPoliticalSkill()).toBe(3);
            this.theirStorehouse = this.player2.placeCardInProvince('imperial-storehouse', 'province 2');
            this.theirStorehouse.facedown = false;
            this.game.checkGameState(true);
            expect(this.ishikawa.getMilitarySkill()).toBe(3);
        });

        // ruling #284: holdings in provinces are in play
        it('should count an Imperial holding in a province', function() {
            this.storehouse = this.player1.placeCardInProvince('imperial-storehouse', 'province 2');
            this.storehouse.facedown = false;
            this.game.checkGameState(true);
            expect(this.ishikawa.getMilitarySkill()).toBe(4);
            expect(this.ishikawa.getPoliticalSkill()).toBe(4);
        });

        // ruling #284: characters in provinces are not in play
        it('should not count an Imperial character in a province', function() {
            this.courtier = this.player1.placeCardInProvince('otomo-courtier', 'province 2');
            this.courtier.facedown = false;
            this.game.checkGameState(true);
            expect(this.ishikawa.getMilitarySkill()).toBe(3);
            expect(this.ishikawa.getPoliticalSkill()).toBe(3);
        });

        // ruling #286: the Imperial Favor is not an Imperial card
        it('should not count the Imperial Favor', function() {
            this.player1.player.imperialFavor = 'military';
            this.game.checkGameState(true);
            expect(this.player1.player.imperialFavor).toBe('military');
            expect(this.ishikawa.getMilitarySkill()).toBe(3);
        });

        // ruling #285: a broken Imperial province has a blank text box and does not count
        it('should count an unbroken faceup Imperial province but not a broken one', function() {
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                province: this.throne,
                attackers: [this.toturi],
                defenders: []
            });
            expect(this.throne.facedown).toBe(false);
            expect(this.ishikawa.getMilitarySkill()).toBe(4);
            this.noMoreActions();
            this.player1.clickPrompt('Pass'); // Before the Throne's interrupt
            expect(this.throne.isBroken).toBe(true);
            expect(this.getChatLogs(5)).toContain('player2 has broken Before the Throne!');
            this.player2.clickPrompt('No');
            expect(this.throne.location).toBe('province 1');
            expect(this.ishikawa.getMilitarySkill()).toBe(3);
            expect(this.ishikawa.getPoliticalSkill()).toBe(3);
        });
    });
});
