describe('Fukurokushi\'s Blessing', function () {
    integration(function () {
        describe('outside conflicts', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        stronghold: 'ebony-blood-garrison',
                        inPlay: ['hida-guardian'],
                        hand: ['fukurokushi-s-blessing'],
                        provinces: ['manicured-garden']
                    },
                    player2: {
                        inPlay: ['solemn-scholar'],
                        provinces: ['avalanche-of-stone']
                    }
                });

                this.garrison = this.player1.findCardByName('ebony-blood-garrison');
                this.blessing = this.player1.findCardByName('fukurokushi-s-blessing');
                this.garden = this.player1.findCardByName('manicured-garden');
                this.avalanche = this.player2.findCardByName('avalanche-of-stone');
                this.guardian = this.player1.findCardByName('hida-guardian');
                this.scholar = this.player2.findCardByName('solemn-scholar');

                this.noMoreActions();
            });

            it('cancels a province triggered ability outside conflicts', function () {
                // Dynasty phase ends, Ebony Blood Garrison triggers
                expect(this.player1).toHavePrompt('Any reactions to dynasty phase ending?');
                this.player1.clickCard(this.garrison);

                // Select own province and opponent's Avalanche of Stone
                this.player1.clickCard(this.garden);
                this.player1.clickCard(this.avalanche);

                // Avalanche of Stone's on-reveal reaction fires for player2
                expect(this.player2).toHavePrompt('Any reactions?');
                expect(this.player2).toBeAbleToSelect(this.avalanche);
                this.player2.clickCard(this.avalanche);

                // Fukurokushi's Blessing should interrupt to cancel
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.blessing);
                this.player1.clickCard(this.blessing);
                expect(this.getChatLogs(10)).toContain(
                    'player1 plays Fukurokushi\'s Blessing to cancel the effects of Avalanche of Stone\'s ability'
                );
                // Characters should not be bowed since Avalanche was cancelled
                expect(this.guardian.bowed).toBe(false);
                expect(this.scholar.bowed).toBe(false);
            });
        });

        describe('during conflicts', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doji-kuwanan'],
                        hand: ['fukurokushi-s-blessing']
                    },
                    player2: {
                        provinces: ['midnight-revels'],
                        inPlay: ['solemn-scholar']
                    }
                });

                this.kuwanan = this.player1.findCardByName('doji-kuwanan');
                this.blessing = this.player1.findCardByName('fukurokushi-s-blessing');
                this.revels = this.player2.findCardByName('midnight-revels', 'province 1');
                this.revels.facedown = false;

                this.noMoreActions();
            });

            it('cancels provinces on attack', function () {
                this.initiateConflict({
                    attackers: [this.kuwanan],
                    type: 'military',
                    province: this.revels
                });

                this.player2.clickCard(this.revels);
                this.player2.clickCard(this.kuwanan);
                expect(this.getChatLogs(10)).toContain('player2 uses Midnight Revels to bow Doji Kuwanan');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.blessing);

                this.player1.clickCard(this.blessing);
                expect(this.getChatLogs(10)).toContain(
                    'player1 plays Fukurokushi\'s Blessing to cancel the effects of Midnight Revels\'s ability'
                );
                expect(this.kuwanan.bowed).toBe(false);
            });
        });
    });
});
